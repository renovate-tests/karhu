# 1.5.0
- Add support for contextual data via getContextualData function of the config. Can be used for fixed information
  (for example process id), or for dynamic additions using for example async hooks.

# 1.4.1

- Dependencies have been updated

# 1.4.0

- Dependencies have been updated
- Typescript applications using karhu are no longer expected to provide their own type information for ansi-styles

# 1.3.0

- Jelpp config has improved logging for error objects
- Jelpp config supports KARHU_NO_JSON environment variable to force text format

# 1.1.0

- Add es5 build and wrappers to allow for IE11 compatibility even if inconveniently

# 1.0.1

- Bugfix: Jelpp config assumed process always had stdout; not necessarily true on browser

# 1.0.0

- Bump major version to 1 as the package is entering production use
- Jelpp config outputs JSON when stdout is not a tty

# 0.4.0

- Prefer object hashes over maps
- outputMapper gets index
- transports completely redone 

0.3.0: Replace outputImpl with transports

0.2.0: Add StatusCodeError support to jelpp config

0.1.0: Support browser usage

