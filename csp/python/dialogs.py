import tkinter as tk
import tkMessageBox as messagebox
import tkSimpleDialog as simpledialog

def ask_color():
    ''' Show the color picker '''
    rgb_color, web_color = tk.colorchooser.askcolor(parent=win,
                                             initialcolor=(win['background']))
    
def show_msgBox():
    ''' Show some message boxes '''
    messagebox.showinfo("Information", "This is some information.")
    messagebox.showwarning("Warning", "You probably shouldn't do that")
    messagebox.showerror("Error", "You shouldn't have done that")
    
def show_yes_no_questions():
    ''' Show some question boxes '''
    answer = True
    while answer == True:
        likePython = messagebox.askyesno("Question","Do you like Python?")
        
        if likePython:
            messagebox.showinfo("Your answer was", "Correct.")
            messagebox.askokcancel("Question","Do you want to see some more?")
        else:
            messagebox.showerror("Your answer was", "Incorrect.")
            messagebox.askretrycancel("Question", "Do you want to try that again?")
        
        answer = messagebox.askyesnocancel("Question", "Continue playing?")
        
        if answer == None:
            messagebox.showinfo("You Chose:", "Cancel!")
        elif answer == True:
            messagebox.showinfo("You Chose:", "Yes")
        elif answer == False:
            messagebox.showinfo("You Chose:", "No") 
            
def show_questions():
    ''' Demonstrate the simple questions '''
    name = simpledialog.askstring("Asking String", "What is your first name?")
    
    if name is not None:
        age = simpledialog.askinteger("Asking Integer", "What is your age?", minvalue=0, maxvalue=100)
        
        if age is not None:
            answer = simpledialog.askfloat("Asking Float", "What is 1/2?", minvalue=0, maxvalue=0.5)
            
            if answer == 1/2:
                messagebox.showinfo("Result", name + ", age " + str(age) + ", correctly thinks that 1/2 is " + str(1/2))
            elif answer is not None:
                messagebox.showinfo("After " + str(age) + " years, " + name + " still does not know what 1/2 is.")

# Create the main window        
win = tk.Tk()
win.title('Dialogs')

# Create buttons to run the demos
msgBtn = tk.Button(win, text="Messages", command=show_msgBox)
msgBtn.grid(row=1, column=1)

ynBtn = tk.Button(win, text="Yes No Questions", command=show_yes_no_questions)
ynBtn.grid(row=2, column=1)

qBtn = tk.Button(win, text="More Questions", command=show_questions)
qBtn.grid(row=3, column=1)

colorBtn = tk.Button(win, text="ColorChooser", command=ask_color)
colorBtn.grid(row=4, column=1)

# Start the event loop
win.mainloop()