"""Create web copies without changing originals. Run with Python + Pillow."""
from pathlib import Path
import json
import hashlib
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source = root.parent / 'Fotos' / 'Fotos para portfólio'
target = root / 'public' / 'photos'
target.mkdir(parents=True, exist_ok=True)
items = [
    ('20251004073047.jpg', 'Entre as folhas', 'Natureza', 'Pequeno primata entre folhas verdes sob o céu azul'),
    ('20251101164808.jpg', 'Companhia', 'Natureza', 'Retrato de um cachorro de pelagem branca e cinza'),
    ('20260328082759.jpg', 'Primeiros caminhos', 'Natureza', 'Filhote de tartaruga visto de cima sobre a areia'),
    ('20260516092032.jpg', 'Um instante de pausa', 'Natureza', 'Beija-flor azul e verde pousado em um galho'),
    ('ariramba-de-cauda-ruiva_WA5225091.jpg', 'Entre verdes', 'Natureza', 'Ave de plumagem verde e azul pousada entre galhos'),
    ('gralha-cancã_WA5220745.jpg', 'Olhar atento', 'Natureza', 'Ave preta e branca com olho amarelo junto a uma cerca de madeira'),
    ('IMG_0303.jpg', 'Silêncio nos galhos', 'Natureza', 'Pequena coruja entre galhos finos'),
    ('IMG_0546.jpg', 'Um verde escondido', 'Natureza', 'Iguana verde entre pedaços de madeira'),
    ('IMG_0561.jpg', 'Pausa entre voos', 'Natureza', 'Beija-flor pousado em um galho com fundo desfocado'),
    ('IMG_1166.jpg', 'Curiosidade em verde', 'Natureza', 'Cabeça de uma serpente verde aparecendo ao lado de um tronco'),
    ('IMG_1986.jpg', 'Cores da natureza', 'Natureza', 'Ave aquática com plumagem dourada e alaranjada vista de perto'),
    ('IMG_2014.jpg', 'Perfil em branco', 'Natureza', 'Ave branca de bico longo alaranjado contra um fundo escuro'),
    ('IMG_7130.jpg', 'Alegria de perto', 'Pessoas', 'Criança sorrindo com as mãos ao lado do rosto'),
    ('IMG_8106 (1).jpg', 'Histórias e sorrisos', 'Pessoas', 'Menina sorrindo em um interior com arquitetura ornamentada'),
    ('IMG_8110 (1).jpg', 'Um sorriso no passeio', 'Pessoas', 'Menina de camiseta verde sorrindo em um ambiente ornamentado'),
    ('IMG_8549 (1) (1).jpg', 'Sorrisos em dupla', 'Pessoas', 'Duas pessoas sorrindo lado a lado, vestindo coletes azuis'),
    ('IMG_8568 (1).jpg', 'Cores da alegria', 'Pessoas', 'Pessoa recebendo pintura artística no rosto'),
    ('IMG_8586 (1).jpg', 'Afeto em foco', 'Pessoas', 'Mulher sorrindo com um bebê no colo'),
    ('IMG_8649.jpg', 'Sorriso pintado', 'Pessoas', 'Menina sorrindo com pintura artística de animal no rosto'),
    ('IMG_8711 (1).jpg', 'Vale brincar', 'Pessoas', 'Criança usando óculos vermelhos e adereço de pirata'),
    ('IMG_8769 (1).jpg', 'Pose com personalidade', 'Pessoas', 'Menina usando óculos verdes e acessórios coloridos'),
    ('IMG_8779.jpg', 'Perto de quem importa', 'Pessoas', 'Duas crianças abraçadas, olhando para a câmera'),
    ('IMG_8843.jpg', 'Juntas no instante', 'Pessoas', 'Três crianças posando juntas em um ambiente de festa'),
    ('IMG_8863 (1).jpg', 'Abraço que fica', 'Pessoas', 'Duas crianças abraçadas perto de uma janela'),
]
metadata = {item[0]: item[1:] for item in items}
excluded = {'IMG_0547.jpg'}
files = sorted(p for p in source.iterdir() if p.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'} and p.name not in excluded)
photos = []
original_size = 0
for index, file in enumerate(files, 1):
    filename = file.name
    title, category, alt = metadata.get(filename, (f'Fotografia {index:02}', 'Pessoas', f'Fotografia de Lucas Balica: {file.stem}'))
    original_size += file.stat().st_size
    with Image.open(file) as raw:
        image = ImageOps.exif_transpose(raw).convert('RGB')
        image.thumbnail((2000, 2000), Image.Resampling.LANCZOS)
        name = hashlib.sha256(file.read_bytes()).hexdigest()[:16] + '.webp'
        image.save(target / name, 'WEBP', quality=85, method=6)
        photos.append(dict(id=name[:-5], source=filename, title=title, category=category, alt=alt,
                           src=f'/photos/{name}', width=image.width, height=image.height))
(root / 'data').mkdir(exist_ok=True)
(root / 'data' / 'photos.json').write_text(json.dumps(photos, ensure_ascii=False, indent=2), encoding='utf-8')
# Remove only obsolete generated web copies inside this project's photos directory.
expected = {photo['src'].split('/')[-1] for photo in photos}
for obsolete in target.glob('*.webp'):
    if obsolete.name not in expected and obsolete.resolve().parent == target.resolve():
        obsolete.unlink()
print(f'{len(photos)} photos; original {original_size / 1048576:.1f} MB; web {sum(p.stat().st_size for p in target.glob("*.webp")) / 1048576:.1f} MB')
