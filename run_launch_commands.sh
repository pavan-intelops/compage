#!/bin/bash

# Open the first tab and execute the "App" command
gnome-terminal -- bash -c 'echo -ne "\033]0;App\007"; cd app && npm run dev; $SHELL'

# Wait for the terminal to launch
sleep 2

# Simulate the keypress for opening a new tab in gnome-terminal (Ctrl+Shift+T)
xdotool key ctrl+shift+t

# Give some time for the tab to open
sleep 1

# Type in the "Core" command, set its title, and execute
xdotool type 'echo -ne "\033]0;Core\007"; cd ../core && go run main.go'
xdotool key Return

# Repeat the steps for the "UI" command
sleep 2
xdotool key ctrl+shift+t
sleep 1
xdotool type 'echo -ne "\033]0;UI\007"; cd ../ui && npm run dev-start'
xdotool key Return
