// sgnk-md — Tauri 2 macOS shell.
//
// Strategy: thin native shell that loads https://md.sgnk.ai inside a
// WKWebView. NextAuth httpOnly cookies, the existing service worker, and
// the share/conflict pipeline all keep working unchanged because the
// webview is just a real browser. Builds a code-signed .app + .dmg with
// `npm run tauri build`.

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder, PredefinedMenuItem},
    AppHandle, Emitter, Manager,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            build_menu(app.handle())?;
            if let Some(w) = app.get_webview_window("main") {
                let _ = w.show();
                let _ = w.set_focus();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running sgnk-md");
}

// ---------------------------------------------------------------------------
// Native menu — gives the app real macOS menu bar feel (Cmd+N, Cmd+R, etc.)
// Each custom item emits a Tauri event; the React app bridges those into
// the existing DOM CustomEvent bus via a tiny listener (see
// src/modules/app-shell/presentation/TauriBridge.tsx).
// ---------------------------------------------------------------------------
fn build_menu(app: &AppHandle) -> tauri::Result<()> {
    // App > sgnk-md submenu.
    let app_menu = SubmenuBuilder::new(app, "sgnk-md")
        .item(&PredefinedMenuItem::about(app, Some("About sgnk-md"), None)?)
        .separator()
        .item(&PredefinedMenuItem::hide(app, None)?)
        .item(&PredefinedMenuItem::hide_others(app, None)?)
        .item(&PredefinedMenuItem::show_all(app, None)?)
        .separator()
        .item(&PredefinedMenuItem::quit(app, None)?)
        .build()?;

    let new_note = MenuItemBuilder::new("New Note")
        .id("file.new-note").accelerator("CmdOrCtrl+N").build(app)?;
    let new_folder = MenuItemBuilder::new("New Folder")
        .id("file.new-folder").accelerator("CmdOrCtrl+Shift+N").build(app)?;
    let close_window = PredefinedMenuItem::close_window(app, None)?;
    let file_menu = SubmenuBuilder::new(app, "File")
        .item(&new_note).item(&new_folder).separator().item(&close_window).build()?;

    let edit_menu = SubmenuBuilder::new(app, "Edit")
        .item(&PredefinedMenuItem::undo(app, None)?)
        .item(&PredefinedMenuItem::redo(app, None)?)
        .separator()
        .item(&PredefinedMenuItem::cut(app, None)?)
        .item(&PredefinedMenuItem::copy(app, None)?)
        .item(&PredefinedMenuItem::paste(app, None)?)
        .item(&PredefinedMenuItem::select_all(app, None)?)
        .build()?;

    let toggle_sidebar = MenuItemBuilder::new("Toggle Sidebar")
        .id("view.toggle-sidebar").accelerator("CmdOrCtrl+B").build(app)?;
    let toggle_right = MenuItemBuilder::new("Toggle Right Pane")
        .id("view.toggle-right").accelerator("CmdOrCtrl+Shift+B").build(app)?;
    let command_palette = MenuItemBuilder::new("Command Palette")
        .id("view.command-palette").accelerator("CmdOrCtrl+P").build(app)?;
    let spotlight = MenuItemBuilder::new("Quick Open")
        .id("view.spotlight").accelerator("CmdOrCtrl+K").build(app)?;
    let search = MenuItemBuilder::new("Search Vault")
        .id("view.search").accelerator("CmdOrCtrl+Shift+F").build(app)?;
    let reload = MenuItemBuilder::new("Reload")
        .id("view.reload").accelerator("CmdOrCtrl+R").build(app)?;
    let reset_pwa = MenuItemBuilder::new("Reset App Cache")
        .id("view.reset-pwa").build(app)?;
    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&toggle_sidebar).item(&toggle_right)
        .separator()
        .item(&command_palette).item(&spotlight).item(&search)
        .separator()
        .item(&reload).item(&reset_pwa)
        .build()?;

    let window_menu = SubmenuBuilder::new(app, "Window")
        .item(&PredefinedMenuItem::minimize(app, None)?)
        .item(&PredefinedMenuItem::maximize(app, None)?)
        .separator()
        .item(&PredefinedMenuItem::fullscreen(app, None)?)
        .build()?;

    let menu = MenuBuilder::new(app)
        .item(&app_menu).item(&file_menu).item(&edit_menu)
        .item(&view_menu).item(&window_menu).build()?;
    app.set_menu(menu)?;

    // Each menu click forwards to the React app via a Tauri event.
    app.on_menu_event(move |app, event| {
        let id = event.id().as_ref().to_string();
        let _ = app.emit("sgnk:menu", id);
    });
    Ok(())
}
