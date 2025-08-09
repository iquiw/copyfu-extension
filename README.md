<p align="center">
  <picture style="vertical-align: bottom;">
    <img src="./src/assets/icon.png" height="64">
  </picture>
</p>

# CopyFU

[![Firefox Add-on](https://img.shields.io/amo/v/copyfu?style=for-the-badge)](https://addons.mozilla.org/ja/firefox/addon/copyfu/)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/egakkoaaohhnfppfhccbklamlcdfabff?style=for-the-badge&color=blue)](https://chromewebstore.google.com/detail/copyfu/egakkoaaohhnfppfhccbklamlcdfabff)

CopyFU is a Web Extension to copy URL and title of the current tab.  
URL and title can be formatted using user-defined [Liquid](https://liquidjs.com) templates.

## Feature

- Copy URL and title with customizable templates
- User-defined Liquid templates for advanced formatting
- Keyboard shortcuts for quick access
- Export/import templates for backup and sharing
- Drag-and-drop sorting for template management

## Usage

### Popup

By clicking CopyFU icon on the toolbar, popup window is shown.  
Then clicking one of the template buttons copied formatted URL and title to clipboard.

#### Available keyboard shortcuts

| Shortcut                    | Action                                                      |
| ---                         | ---                                                         |
| <kbd>Ctrl+Shift+U</kbd>     | Open CopyFU popup                                           |
| <kbd>1</kbd> ~ <kbd>9</kbd> | Copy formatted URL and title with template indexed by 1 ~ 9 |

## Development

### Prerequisites

[bun](https://bun.sh) needs to be installed.  
Then, install dependencies.

```console
$ bun i
```

### Build

```console
$ bun run zip             # for Chrome
$ bun run zip:firefox     # for Firefox
```

### TODO

- [x] Copy formatted template
- [x] Save format templates
- [x] Sort format templates by DnD
- [x] Shortcut for popup
- [ ] Shortcuts for copy
- [x] App icon
- [x] Icon font
- [ ] Liquid filter `sub`
- [ ] Liquid filter `match`
- [x] Export
- [x] Import
- [ ] I18N
- [ ] Presets
- [ ] Visual effect at copy
