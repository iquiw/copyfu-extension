## TODO

- [x] Copy formatted template
- [x] Save format templates
- [ ] Sort format templates by DnD
- [x] Shortcut for popup
- [ ] Shortcut for copy
- [x] App icon
- [ ] Icon font
- [ ] Liquid filter `sub`
- [ ] Liquid filter `match`
- [ ] Export
- [ ] Import
- [ ] I18N
- [ ] Presets
<p align="center">
  <picture style="vertical-align: bottom;">
    <img src="./src/assets/icon.png" height="64">
  </picture>
</p>

# CopyFU

[![Firefox Add-on](https://img.shields.io/amo/v/copyfu?style=for-the-badge)](https://addons.mozilla.org/ja/firefox/addon/copyfu/)

CopyFU is a Web Extension to copy URL and title of the current tab.
URL and title can be formatted user-defined [Liquid](https://liquidjs.com) templates.

## Development

### Prerequisites

[bun](https://bun.sh) needs to be installed.

Then install dependencies.

```console
$ bun i
```

### Build

```console
$ bun run zip             # for Chrome
$ bun run zip:firefox     # for Firefox
```

