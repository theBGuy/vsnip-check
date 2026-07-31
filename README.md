![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/theBGuy.vsnip-check)

# vsnip-check
Syntax highlighting for .nip pickit files in vscode\
Provides error checking on save and while typing\
Provides tab completion of properties, stats, and ids
Only tested with dark theme, but should work with others

## Configuration

You can extend parser validation and completion lists from settings:

```json
{
	"vsnip-check.additionalProperties": ["mycustomproperty"],
	"vsnip-check.additionalStats": ["mycustomstat"],
	"vsnip-check.additionalExtras": ["mycustomextra"]
}
```

These additions are merged with built-in values and apply to `.nip` files and NIP strings embedded in JavaScript/TypeScript.

## How to install

### Extension from Visual Studio Marketplace (recommended)
Visit https://marketplace.visualstudio.com/items?itemName=theBGuy.vsnip-check

Or...

1) Open Visual Studio Code and hit (Ctrl + Shift + X) or Open the Extensions tab
2) Search for vsnip-check
3) Hit install then enjoy

### Manually
Download the latest .vsix file from [releases](https://github.com/laztheripper/vsnip/releases/tag/default)\
Click on the Extensions icon on the Activity Bar on the side of the editor\
Click the ... icon in the Extensions view, then click on "Install from VSIX..."\
Select the .vsix file you want to install and click the "Open" button\
\
Or...\
\
Move the entire folder to your extensions folder which should be **here**:
```
Windows: %USERPROFILE%\.vscode\extensions
macOS: $HOME/.vscode/extensions
Linux: $HOME/.vscode/extensions
```
**Enjoy!**

## Development

Requires Node >= 22 and pnpm.

```
pnpm install
pnpm test        # cleans dist, compiles, runs the unit tests (incl. the ReDoS canaries)
pnpm run build   # package a .vsix (runs the tests via vscode:prepublish)
```

One rule to know before touching the JS/TS scanner: every regex it runs against document lines
lives in `LINE_SCANNING_REGEXES` in `src/scanner.ts` — the ReDoS canary tests iterate that
object (and a guard test rejects regex literals defined outside it), so new scan regexes are
guarded automatically and must be defined there. The `.nip` validator in `src/diagnostics.ts`
is not yet under the same guard — see issue #11 before adding regexes there.

![image](https://user-images.githubusercontent.com/1103794/232825340-28ee3222-70c8-462b-b6da-c5b55a2322f3.png)

![image](https://github.com/theBGuy/vsnip-check/assets/60308670/aaaf4667-6d46-4c0f-8431-55f8b5b8dd3a)

![image](https://github.com/theBGuy/vsnip-check/assets/60308670/f518555b-1553-4790-b9c3-c0f8ce6c22cd)

https://github.com/theBGuy/vsnip-check/assets/60308670/0c246cfb-c4a6-4800-b571-d1b965033336
