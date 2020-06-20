To Do:
- Good README.md files that help the reader with code navigation and installation.
    - What is the project?
    - What problem does it solve?
    - Exceptional difficulties and solutions, if any.
    - TODO list/wishlist. What do you want to add to it if you have more time?



##  Understand:
- CA/Turing Completeness details in CA_notes.md
- MVP:
    - Display:
        - min 25 x 25 grid
        - each cell tappable to toggle dead/alive (while NOT running)
        - numerical display of # generation dead/alive at every generation run
        - timeout function to build next generation of cells and update the display at the chosen time interval
        - start/stop/about CA/clear grid buttons
        -Create a few sample cell configurations that users can load and run
        - Add an option that creates a random cell configuration that users can run
        - Add additional cell properties, like color or size, and incorporate them into your visualization
    - Algorithm:
        - know states of current cell and 8 neighbors
        - Apply Rules of GoL:
            1. If an organisim is alive and has 2 or 3 neighbors, then it remains alive in the next generation. Else it dies.
            2. If an organisim is dead and has exactly 3 neigbors, then it comes back to life in the next generation. Else it stays dead
        - copy seed grid state, update as next generation loop completes, swap in as double buffer system

## Plan
- create React app
    - 

- Grid and Cell components
    - Grid properties:
        - location row

- Algorthim logic in Grid