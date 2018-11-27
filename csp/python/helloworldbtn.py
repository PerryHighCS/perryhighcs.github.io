import tkinter as tk

# Create the application window
win = tk.Tk()

# Create the user interface
my_label = tk.Label(win, text="Hello World!")
my_label.grid(row=1, column=1)
quit_button = tk.Button(win, text="Quit")
quit_button.grid(row=2, column=1)
quit_button['command'] = win.destroy

# Start the GUI event loop
win.mainloop()