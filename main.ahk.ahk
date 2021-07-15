SetTitleMatchMode, 2

#persistent
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

gui, new
gui +MaximizeBox
gui, show, w800 h800, TITLE

F15::
    FormatTime, Now,, yyyy:MM:dd HH:mm:ss 
    FileAppend, %Now%`n, C:\Users\egork\Desktop\dairy\counter.txt
    return

!t::
    FormatTime, Now,, yyyy:MM:dd HH:mm:ss
    FileAppend, %Now%`n, C:\Users\egork\Desktop\dairy\counter.txt
    return

F13::
	Send, +#{Left}
	return

F14::
	Send, +#{Right}
	return

F5::
	WinActivate, TITLE
	return

Shift::
if (A_ThisHotkey == A_PriorHotkey && A_TimeSincePriorHotkey <= 500)
{
  Send, {LWin down}{Space}{LWin up}
}
return

#IfWinActive TITLE
  b::
    Count := 0
    Loop, C:\Users\egork\Desktop\dairy\sleeps\*.*
      Count++
    FormatTime, Now,, yyyy:MM:dd HH:mm:ss
    FileAppend, %Now%`n, C:\Users\egork\Desktop\dairy\sleeps\%Count%.txt
    return

#IfWinActive Notepad++
  Tab::
    Send, {Home}{Enter}{UP}
    return