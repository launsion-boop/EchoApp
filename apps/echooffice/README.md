# EchoOffice

EchoOffice is an AI-first Office workbench for EchoBraid.

It opens local Office files in a real document surface:

- DOCX, XLSX, and PPTX use the local ONLYOFFICE runtime provided by EchoBraid Desktop.
- PDF opens as a read-only document surface.
- EchoAgent can read and rewrite the active document through the app bridge.

EchoOffice edits the workspace copy created by EchoBraid instead of mutating the user's original imported file directly.
