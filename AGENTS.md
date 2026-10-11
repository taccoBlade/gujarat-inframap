# Gujarat InfraMap — AI Development Rules

## Before coding
- Read this file and the relevant architecture documentation.
- Inspect the specific components, interfaces and services involved in the task.
- Use targeted searches and file metadata instead of dumping entire files into context.
- Do not inspect unrelated modules unless dependencies require it.

## Geospatial data
- Never read an entire large GeoJSON, CSV, JSON or other geospatial dataset into AI context by default.
- Inspect file size, feature count, schema, a small sample and processing metadata first.
- Do not embed large datasets in application source code.
- Do not regenerate large processed datasets for unrelated UI changes.
- Never delete or overwrite original datasets without explicit authorization.
- Preserve source attribution, licenses, stable IDs and provenance.
- Use existing data-access interfaces instead of introducing direct dataset imports into components.

## Architecture
- Reuse existing components, hooks, types, services and styles.
- Do not create duplicate features or duplicate state systems.
- Keep UI, domain logic, data access and ETL responsibilities separate.
- Avoid giant components with unrelated responsibilities.
- Do not split files artificially to meet line-count targets.
- Do not add dependencies or infrastructure without a demonstrated need.

## UI and GIS
- Preserve the current map library, layer controls, asset inspector and navigation.
- New modules must use shared layouts, modal components and asset schemas.
- Preserve responsive behavior and existing user interactions.
- Do not fabricate engineering data or simulated live status.

## Validation
- Run the smallest relevant test set first.
- Run broader checks when shared architecture or data pipelines change.
- Do not claim tests or benchmarks passed unless they actually ran.
- Report changed files, validation results and unresolved issues concisely.

## Context efficiency
- Prefer summaries, targeted diffs, schema inspection and small samples.
- Do not paste massive generated files into conversations.
- Do not run full ingestion, ETL or build pipelines unless necessary.
- Keep documentation concise and focused on helping future tasks.