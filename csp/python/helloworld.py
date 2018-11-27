import tkinter as tk

# Create the application window
win = tk.Tk()

# Create the user interface
my_label = tk.Label(win, text="Hello World!")
my_label.grid(row=1, column=1)

# Start the GUI event loop
win.mainloop()