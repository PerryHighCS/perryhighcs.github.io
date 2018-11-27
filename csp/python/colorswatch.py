import tkinter as tk
from tkinter import colorchooser

# Define the event handler
def ask_color():
    rgb_color, web_color = colorchooser.askcolor(parent=win,
                                             initialcolor=(win['background']))
    win['background']=web_color
    colorLbl['text']=web_color

win = tk.Tk()
win.title('Swatch')
win.geometry("500x500")

# Create the user interface
colorBtn = tk.Button(win, text="Click to choose a color.")
colorBtn.grid(row=1, column=1)
colorBtn['command'] = ask_color

colorLbl = tk.Label(win, text="#")
colorLbl.grid(row=1, column=2)

# Start the event loop
win.mainloop()