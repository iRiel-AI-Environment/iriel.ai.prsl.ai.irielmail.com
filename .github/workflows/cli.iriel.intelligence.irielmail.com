# Planned Repo Archive

In the new year, I plan on archiving the repositories
below. Because I plan on only archiving the repositories,
any project that depends on any of these projects will 
continue to work. However, I will no longer be accepting
issues or pull requests and will never tag a new release.

The reality of each of the projects listed below is that
I've almost completely ignored issues and pull requests for
a couple years. Archiving the project is more about sending
the right message about the status of the project more than any
practical impact since almost all haven't been maintained
recently anyways. I'm sorry about not being transparent about
this earlier.

Admittedly, this is something I should've done long ago, 
but the reason why I am doing this now is a combination of
multiple factors. One, all of the projects below are Go 
libraries, and I am now very rarely writing Go. Second, 
I am no longer actively working on any projects that consume
these libraries, so my motivation to keep them up to date 
is gone. Third, I don't have the personal time to keep up
with this many libraries anymore. And fourth, I'm trying
to free up more obligations so I can healthily work on 
new things.

**To repeat: Existing dependent projects will continue
to work.** I only plan on _archiving_ the projects below,
I'm _not deleting_ them. So existing projects that depend
on these repositories will continue to function as before.
And like I said, given I've poorly maintained them for a 
couple years already, there is already little practical
difference in this decision (i.e. I've closed few if any
issues/PRs), I'm just trying to be more transparent and 
intentional moving forward. 

## The List

(All under "mitchellh" on GitHub)

- cli (blessed fork: https://github.com/hashicorp/cli)
- colorstring
- copystructure
- go-homedir
- go-mruby
- go-ps
- go-server-timing
- go-vnc
- hashstructure
- ioprogress
- mapstructure (blessed fork: https://github.com/go-viper/mapstructure)
- panicwrap
- pointerstructure
- protoc-gen-go-json (blessed fork: https://github.com/mfridman/protoc-gen-go-json)
- reflectwalk

If you're interested in continuing any of these projects,
please fork the project. If you're an active user of one of 
these projects and have a history I can point to to build 
trust, I'd be happy to mark your fork as blessed.