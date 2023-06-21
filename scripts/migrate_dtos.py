import os
import re

'''
This script is used to migrate the DTOs from the backend to the frontend.

It reads the `backend_path` DTOs and formats them before writing them to the `frontend_path`.
This is needed because in NestJS, DTOs are classes using decorators, while in the frontend, they are basic interfaces.

The use of the script allows to have a single source of truth for the DTOs, and to avoid having to maintain two different versions of the same DTO.
'''

EXCEPTION_FILES = ["index.ts"]
# EXCEPTION_FILES = os.getenv("EXCEPTION_FILES")

backend_path = './backend/src/common/types/summoners'
frontend_path = './frontend/src/lib/types/imported'

backend_files = [f for f in os.listdir(backend_path) if f not in EXCEPTION_FILES]

flag: bool = False

for backend_file in backend_files:
    classes: list[list[str]] = []
    imports = []
    unique_class = []
    with open(os.path.join(backend_path, backend_file)) as f_back:
        for idx, line in enumerate(f_back.readlines()):
            if "import" in line and "ApiProperty" not in line:
                imports.append(line)
            if "class" in line:
                unique_class = []
                flag = True
                unique_class.append(line)
            elif line.startswith("}") and flag:
                unique_class.append(line)
                flag = False
                classes.append(unique_class)
            elif flag:
                unique_class.append(line)

    new_lines: list[str] = []
    if imports:
        for imp in imports:
            new_lines.append(imp.replace("import", "import type"))
        new_lines.append('\n')
    
    for cl in classes:
        for idx, line in enumerate(cl):
            if "class" in line or re.search(r'^ {4}[a-zA-Z]+:', line):
                new_lines.append(line.replace("class ", "interface "))
        new_lines.append('}\n\n')
    
    with open(os.path.join(frontend_path, backend_file), "w") as f_front:
        f_front.writelines(new_lines)
    