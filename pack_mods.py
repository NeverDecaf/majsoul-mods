#!/usr/bin/env python3
### package all .js files as both a userscript and mjs+ mod
### first line of file will be used for description
import os
from io import BytesIO
import zipfile

AUTHOR = 'NeverDecaf'
HEADER = '''// ==UserScript==
// @name         {name}
// @namespace    https://github.com/{author}/
// @version      0.1
// @description  {desc}
// @author       {author}
// @match        https://www.majsoul.com/*
// @match        https://game.maj-soul.com/*
// @match        https://majsoul.union-game.com/
// @match        https://game.mahjongsoul.com/
// @match        https://mahjongsoul.game.yo-star.com/
// @grant        none
// ==/UserScript==
'''
EXTENSION = '''{{
  "id": "{id}",
  "version": "0.0.1",
  "name": "{name}",
  "author": "{author}",
  "description": "{desc}",
  "preview": "preview.png",
  "entry": ["{script}"]
}}'''

# delete old files?
# for name in os.listdir('.'):
    # ext = os.path.splitext(name)
    
for root, dirs, files in os.walk('.'):
    for name in filter(lambda f: f.lower().endswith('.js') and not f.lower().endswith('.user.js') ,files):
        dispname = os.path.splitext(name)[0]
        with open(os.path.join(root, name), 'rb') as ofile:
            desc = ofile.readline().strip(b'/ \t\n\r').decode('utf8')
            with open(os.path.join(root, dispname+'.user.js'), 'wb') as file:
                file.write(HEADER.format(name=dispname,author=AUTHOR,desc=desc).encode('utf8'))
                file.write(ofile.read())
        extjson = BytesIO()
        extjson.write(EXTENSION.format(id=dispname, name=dispname ,author=AUTHOR, script=name, desc=desc).encode('utf8'))
        with zipfile.ZipFile('{}.mspe'.format(dispname), mode="w",compression=zipfile.ZIP_DEFLATED) as zf:
            zf.writestr('{}\\extension.json'.format(dispname),extjson.getvalue())
            zf.write(name,'{}\\{}'.format(dispname,name))
            zf.write('preview.png','{}\\preview.png'.format(dispname))
