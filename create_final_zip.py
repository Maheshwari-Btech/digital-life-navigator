import os
import zipfile

output_filename = "DigiGuide-Final.zip"

exclude_dirs = {
    "node_modules",
    ".next",
    "venv",
    "__pycache__",
    ".git",
    "dist",
    "build",
    ".aistudio"
}

exclude_files = {
    ".DS_Store",
    "digiguide_navigator.db",
    "digital_life_navigator.db",
    "DigiGuide-Final.zip",
    "create_final_zip.py"
}

print(f"Creating {output_filename}...")

with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file in exclude_files:
                continue
            if file.endswith('.db') or file.endswith('.pyc') or file.endswith('.zip'):
                continue
                
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, '.')
            if rel_path.startswith('./'):
                rel_path = rel_path[2:]
            if rel_path == output_filename or rel_path == "create_final_zip.py":
                continue
                
            zipf.write(file_path, rel_path)
            print(f"Added: {rel_path}")

print(f"Successfully created {output_filename}!")
