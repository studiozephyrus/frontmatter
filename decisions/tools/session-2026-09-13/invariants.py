import json,re,sys
A=json.load(open(sys.argv[1])); B=json.load(open(sys.argv[2]))
qa,qb=A['questions'],B['questions']
errs=[]
if A['cat']!=B['cat']: errs.append('cat')
if len(qa)!=len(qb): errs.append('card count')
rx=r'[\w./()\[\]-]+\.(?:md|ts|tsx|js|json|rules|mjs):\d+'
def prose(q,fields_q=('q','lede','stakes','state','tension','recCase','flip'),fields_o=('what','gains','costs','system','screens','money')):
    return json.dumps([q.get(k) for k in fields_q]+[[o.get(k) for k in fields_o] for o in q['options']],ensure_ascii=False)
moved=0
for a,b in zip(qa,qb):
    i=a['id']
    for k in ('id','cat','sub','weight','rec','evidence','visual'):
        if json.dumps(a.get(k),ensure_ascii=False)!=json.dumps(b.get(k),ensure_ascii=False): errs.append(f'{i}.{k} changed')
    if len(a['options'])!=len(b['options']): errs.append(f'{i} option count')
    for oa,ob in zip(a['options'],b['options']):
        if oa['k']!=ob['k'] or oa['label']!=ob['label']: errs.append(f'{i}.{oa["k"]} k/label changed')
        for f in ('gains','costs'):
            if len(oa[f])!=len(ob[f]): errs.append(f'{i}.{oa["k"]}.{f} bullet count {len(oa[f])}->{len(ob[f])}')
            if not 1<=len(ob[f])<=2: errs.append(f'{i}.{oa["k"]}.{f} out of budget')
    if not set(a['sources'])<=set(b['sources']): errs.append(f'{i} sources lost {set(a["sources"])-set(b["sources"])}')
    if not set(a.get('linked') or [])<=set(b.get('linked') or []): errs.append(f'{i} linked lost')
    # every citation that was in prose before must be in sources after
    before=set(re.findall(rx,prose(a)))
    miss=[r for r in before if r not in b['sources']]
    if miss: errs.append(f'{i} citations missing from sources: {miss}')
    moved+=len(before)
    for f,lo,hi in (('state',2,3),('tension',2,3),('recCase',2,2)):
        if len(a[f])!=len(b[f]) or not lo<=len(b[f])<=hi: errs.append(f'{i}.{f} bullets {len(a[f])}->{len(b[f])}')
    if 'path' in b: errs.append(f'{i} path reintroduced')
    # nothing but prose, linked may differ
    ka=set(a)-{'q','lede','stakes','state','tension','recCase','flip','options','linked'}
    for k in ka:
        if a[k]!=b[k]: errs.append(f'{i}.{k} changed unexpectedly')
    left=re.findall(rx,prose(b))
    if left: errs.append(f'{i} citations still in prose: {left}')
print('unique prose citations before (all must be in sources after):',moved)
print('ERRORS:',errs if errs else 'none')
