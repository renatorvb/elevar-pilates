# Elevar Pilates — landing page

Site estático de página única. HTML, CSS e JS puros, sem build e sem dependências externas
(apenas Google Fonts e o iframe do Google Maps).

## Rodar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

Abrir o `index.html` direto pelo `file://` também funciona, mas o vídeo do hero
pode não dar autoplay em alguns navegadores — prefira o servidor local.

## Estrutura

```
index.html
assets/css/style.css
assets/js/main.js
assets/img/          fotos otimizadas para web + logo em PNG transparente
assets/video/hero.mp4
img/, video/         arquivos originais (não usados pelo site)
```

A marca (`assets/img/logo-mark.png`) foi extraída da placa da fachada e recortada com
fundo transparente. A versão azul (`logo-mark-blue.png`) serve de favicon.

## Antes de publicar — o que ainda precisa dos dados reais

| Onde | O quê |
| --- | --- |
| Seção "Conheça a profissional" | nome, instituição de formação, especializações e anos de experiência (campos marcados com `data-fill` no HTML) |
| Seção "Depoimentos" | os três textos são exemplos; substituir por avaliações reais de alunos |
| Seção "Como funcionam as aulas" | conferir se a duração de 50 min e a frequência de 2–3x/semana batem com a rotina do estúdio (também citadas no FAQ) |

Ambos os blocos estão sinalizados com comentários `<!-- TODO -->` no `index.html`.

## Dados de contato usados

- WhatsApp: (85) 99670-7975 — links `wa.me/5585996707975` com mensagem pré-preenchida
- Instagram: [@elevarstudiopilates](https://www.instagram.com/elevarstudiopilates)
- Endereço: R. Waldery Uchôa, 250 A — Benfica, Fortaleza-CE
- Horário: seg–qui 07:00–12:00 e 15:00–20:00 · sex 07:00–12:00
