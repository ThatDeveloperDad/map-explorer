# Code Review / Refactor notes

This document is intended to list out the maintainability issues I find while reviewing the overall structure of this subsystem, and the code artifacts within.

The goal is to ensure that the system is easily testable, extendable, and maintainable for future use cases of a "map-runner" like this.

## Potential Use Cases for this experiment:

Use in a Virtual TableTop that looks and feels more like those old-school First-Person turn based dungeon crawler games like Wizardry and Eye of the Beholder.

This MapRunner component will not be used to RUN a tabletop session, but rather to provide a visual aid to the players. The primary "game loop" and encounter runner, etc... would all be components that are external to this codebase.

MapRunner should be considered a "presentation service" within the larger VTT system, should I proceed with that larger scoped project.

I may also leverage this code in a "Dungeon Designer" feature that I'm considering.

## Structure

All operational code is contained in the /src folder, we'll be focusing our efforts within that directory tree.

| path                             | purpose                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ./index.html                     | provides the shell that's loaded into the browser                                                     |
| ./src                            | holds all javascript & stylesheets for this component                                                 |
| ./src/main.js                    | "bootstraps" the component, loading it into its home container in index.html                          |
| ./src/style.css                  | provides CSS Styling that's used throughout the parts of this component                               |
| ./src/components                 | Holds the UI components that are rendered to the browser                                              |
| ./src/components/Controls        | Holds components that allow end-user control over map movement and display options                    |
| .../Controls/ControlBox.js       | Defines a base class that contains different "control buttons" used in different contexts.            |
| .../Controls/MinimapControls.js  | Extends ControlBox to provide controls for the minimap component. (Layout and identification only)    |
| .../Controls/MovementControls.js | Lays out and identifies the buttons that provide the UI for moving through the map.                   |
| ./src/components/MapViewer       | Holds components that display the selected map in different views. (Top-Down 2D, and First-person 3D) |

**./src/main.js**  
 There's a lot of instantiation of parts & dependencies, as well as a lot of event wireup happening in this file. After we've cleaned up the sub-components, we should study this file for opportunities to encapsulate much of this.

**./src/style.css**  
 Currently, this is the ONLY source for CSS directives in the application, and contains a lot of single-use css classes that are specific to individual parts. Consider consolidation of common style directives into more general purpose classes. Also consider moving the single-use classes closer to the parts that use them.

**./src/Controls/**  
These js components are probably okay for now. Might consider moving the Minimap and Movement controls files & code into more cohesive component structures later. No changes for now.

**./src/MapViewer/**  
There's a LOT of cleanup to do in here, especially for the 3D view. (it's a mess...)
