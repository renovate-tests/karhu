# Karhu node.js logging

Karhu is a simple logging library for node.js. The main feature that sets it apart is the ability
to specify different log levels for different modules, so that you don't need to see the debug
logs of the entire code base just to find the thing you are interested in.

## Installation

`npm install --save karhu`

## Usage

### Basic usage

Let's start with a simple example

    const log = require('karhu').context(__filename)
    // ...
    log.info('Server startup complete')
    log.error(new Error('Startup failed'))

### API

For all the code examples presented here, `const karhu = require('karhu')` is expected to
be present in the file before the examples.

#### Creating a logger

By default a karhu logger is set up with the default build in configuration. Your application
can set up a different configuration to be used.

Changing the default config (which should be used by libraries using karhu) can be done by

    karhu.configure(newConfig) 

where newConfig of course is the new configuration.

You can also create karhu loggers with specific configuration objects without changing the default
by calling
   
    const configuredKarhu = karhu.usingConfig(newConfig)
    
You can then use `configuredKarhu` as if it was karhu itself, is just uses a different set of
configuration options.

Every karhu logger has context. This allows for making events from different sources distinctly
different. The context is a string; you can specify whatever you want.
 
    const log = karhu.context('mymodulename')
 
If the context is a filename, then common prefix of karhu installation and the filename is 
automatically omitted along with the file extension. So if you have the following directory structure:

    /home/me/app/
        package.json
        src/
            app.js
        node_modules/
            karhu

And `app.js` creates a logger using `const log = karhu.context(__filename)`, the context
actually becomes `src/app`.

### Logging

A logger has methods for all of the specified logging levels. The default levels are

- none; never to be printed; not useful for logging, but can be used to disable logging
- debug
- info
- warn
- error

Each method can take any number of all kinds of arguments and they will (by default) be printed
just as `console.log` would.        

### Configuration

Karhu is configured using a javascript object, that has properties presented below. You probably want
to base your config based on the default config, which can be obtained using `require('karhu/lib/config/default')`

#### logLevels

`logLevels` is an array of strings, which are the log levels available for logging. The log levels in this array
should generally be in ALL CAPS, they will be available in the logger both using the presented form as well
as in all lowercase. In other words, `ERROR` here allows both `log.error` and `log.ERROR` to be used. 

If multiple log levels map to the same lowercase form (and neither is all lowercase), then the first one encountered
will be made available.

The log levels must be presented in ascending order of importance.

    const logLevels = ['INF', 'WARN', 'ERR']

#### colors

Karhu supports colors to emphasize more important information. `colors` is an object that maps log levels to their
colors. Colors are expected to be colors from the `ansi-styles` node.js library, or compatible.

A single color can be defined, or an array of colors if you want to change both the foreground and background colors, 
for example.

    const colors = {
        ERROR: [styles.color.whiteBright, styles.bgColor.redBright],
        NOTICE: styles.color.blueBright
    }

#### formatBefore

Logged events can be prefixed by whatever you want. The default prefix includes the moment of the event in UTC time,
event type and context.

You can provide a function to update the format to become whatever you want. If the output of the
function does not include the value in the `colorStart` parameter, colors are disabled.

    const formatBefore = (logLevel, context, colorStart, toLog) => colorStart 
    
The parameters are:

- logLevel: the log level for the event being logged
- context: the context for the event
- colorStart: an ANSI sequence to set up the color, or empty string if colors are not supported
- toLog: an array of whatever is being logged

#### contextSpecificLogLevels

This object allows you to specify log levels for individual contexts to be different from the
default.

    const contextSpecificLogLevels = {
        "src/app": "ERROR" // ignore everything less than an error
    }
    
#### defaultLogLevel

This string specifies the default log level -- anything lower in importance will not be logged.

#### envVariablePrefix

This variable can be used to specify a prefix for environment variables used for runtime configuration.
By default the prefix is just `KARHU`.

#### outputMapper

This is a function that maps data being output to another form. It is given a value being logged
along with other relevant information and it is expected to return whatever is to be passed to
`console.log` (or one of its siblings).

    const outputMapper = (value, logLevel, context, toLog) => {
        if (value === undefined) return '(undefined)'
        return value    
    } 

### Run-time configuration

You can override some configuration options using environment variables.

Note that the configuration can change the KARHU prefix of the environment variables to become
something else.

#### Overriding default log level

You can set a different default log level to be used using the `KARHU_LOG_LEVEL` environment
variable.

    KARHU_LOG_LEVEL=debug node src/app

#### Overriding context-specific log level

You can set a different log level for an individual module using environment variables that
include the context.

    KARHU_LOG_LEVEL_src_app=DEBUG node src/app # set DEBUG as the log level for src/app
    
Any sequences for non-English-alphanumeric characters in the module name are replaced by
underscores in the environment variable name. 

## Development

### Running tests

    npm test
    
### Releasing

    npm release patch # +0.+0.+1
    npm release minor # +0.+1.0
    npm release major # +1.0.0
