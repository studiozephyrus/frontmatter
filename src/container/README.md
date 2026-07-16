# container
Composition root. dependency-container.ts wires infrastructure into use-cases
and is the ONLY container module app/presentation may import. Per-concern files
(cache-services, job-queue...) stay internal.
