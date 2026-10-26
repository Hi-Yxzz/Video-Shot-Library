#!/usr/bin/env python3
"""Restore archived media and verify all archived file contents."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import tempfile


def sha256(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def child(root, name):
    relative = Path(name)
    if relative.is_absolute() or '..' in relative.parts:
        raise ValueError(f'Unsafe archive path: {name}')
    target = root / relative
    if not target.resolve().is_relative_to(root.resolve()):
        raise ValueError(f'Path escapes archive directory: {name}')
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--verify', action='store_true', help='Verify all files without downloading or restoring.')
    parser.add_argument('--source-only', action='store_true', help='Verify only the source files stored in Git.')
    parser.add_argument('--assets', type=Path, help='Use release assets already downloaded to this directory.')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    manifest = json.loads((root / 'manifest.json').read_text())
    for entry in manifest['files']:
        child(root, entry['path'])

    if not args.verify and not args.source_only:
        with tempfile.TemporaryDirectory(prefix='remotion-archive-') as temporary:
            cache = Path(temporary)
            asset_dir = args.assets or cache / 'downloads'
            if not args.assets:
                asset_dir.mkdir()
                # The local proxy interrupted HTTP/2 transfers during migration.
                transfer_env = os.environ.copy()
                transfer_env['GODEBUG'] = 'http2client=0'
                subprocess.run([
                    'gh', 'release', 'download', manifest['releaseTag'],
                    '--repo', manifest['repository'], '--pattern', 'media-objects-*.tar',
                    '--dir', str(asset_dir),
                ], check=True, env=transfer_env)
            object_dir = cache / 'objects'
            object_dir.mkdir()
            for asset in manifest['mediaAssets']:
                asset_path = child(asset_dir, asset['name'])
                if sha256(asset_path) != asset['sha256']:
                    raise ValueError(f'Release asset checksum mismatch: {asset["name"]}')
                expected = set(asset['objects'])
                seen = set()
                with tarfile.open(asset_path, 'r') as archive:
                    for member in archive:
                        prefix, separator, digest = member.name.partition('/')
                        if prefix != 'objects' or not separator or digest not in expected or digest in seen or not member.isfile():
                            raise ValueError(f'Unexpected media archive member: {member.name}')
                        stream = archive.extractfile(member)
                        if stream is None:
                            raise ValueError(f'Missing media archive member: {member.name}')
                        target = child(object_dir, digest)
                        with stream, target.open('wb') as output:
                            shutil.copyfileobj(stream, output)
                        if sha256(target) != digest:
                            raise ValueError(f'Media checksum mismatch: {digest}')
                        seen.add(digest)
                if seen != expected:
                    raise ValueError(f'Incomplete media archive: {asset["name"]}')
            for entry in manifest['files']:
                if entry['storage'] != 'release':
                    continue
                dest = child(root, entry['path'])
                if dest.exists():
                    if sha256(dest) != entry['sha256']:
                        raise ValueError(f'Refusing to overwrite modified file: {entry["path"]}')
                    continue
                dest.parent.mkdir(parents=True, exist_ok=True)
                with tempfile.NamedTemporaryFile(dir=dest.parent, delete=False) as stream:
                    pending = Path(stream.name)
                    with child(object_dir, entry['sha256']).open('rb') as source:
                        shutil.copyfileobj(source, stream)
                pending.chmod(entry['mode'])
                os.replace(pending, dest)

    failures = []
    checked = 0
    for entry in manifest['files']:
        if args.source_only and entry['storage'] != 'git':
            continue
        path = child(root, entry['path'])
        if not path.is_file() or path.stat().st_size != entry['size'] or sha256(path) != entry['sha256']:
            failures.append(entry['path'])
        checked += 1
    if failures:
        for path in failures:
            print(f'FAILED {path}')
        raise SystemExit(f'{len(failures)} of {checked} file checks failed.')
    print(f'Verified {checked} files with SHA-256. All contents match the original snapshots.')


if __name__ == '__main__':
    main()
