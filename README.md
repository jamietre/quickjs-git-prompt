# parse-git-status

This is a script that generates data I can use to set a useful prompt with oh-my-zsh. 

* this is not awesome code
* there are lots of other ways to do this
* it probably has bugs

The point of this just to demonstrate [QuickJS](https://bellard.org/quickjs/), a JavaScript compiler, for something practical. 

This code is used in my `.zshrc` as follows:

```
git_prompt() {
  git status -s -b --porcelain 2>&1 | ~/.scripts/parse-status-quick
}


precmd() {
  parts=$(git_prompt_info)
  short_path=${parts[(ws:|:)1]}
  git_info=${parts[(ws:|:)2]}
}

export PROMPT='[%{$fg_bold[green]%}$short_path%{$reset_color%}]%{$fg_bold[cyan]%}$git_info%{$reset_color%}> '
```

Now I get a formatted prompt that shows me the last 2 segments of the current directory, the git branch name, and an asterisk to indicate it's got unstaged changes, and behind/ahead commit numbers e.g.

```
[code/quickjs-git-prompt] *master[+1]>
```

I used to do this with node, but node's got a perceptible startup lag, even on a really fast machine. Along comes QuickJS. This is a really neat project, and command-line utilities seem like a perfect application.

I got a little help from [twardoch/svgop](https://github.com/twardoch/svgop) in dealing with stdin, since the OS interop doens't work like node. [Alessandro Nadalin](https://odino.org/playing-with-quickjs/) also has a helpful intro on compiling binaries.

## building

To build this, you'll need to install QuickJS:

```
git clone https://github.com/ldarren/QuickJS.git
cd QuickJS
sudo make install
````

Now build this:

```
./build
```

Try it out:

```
git status -s -b --porcelain 2>&1 | ./dist/parse-status-quick
```

