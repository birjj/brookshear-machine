# Brookshear Machine

A Brookshear Machine emulator written in React, with Mobx for state handling.

Need an example program? Try these:

#### Swap two RAM cells

```
110A
120B
310B
320A
C000
0A0C;These will be swapped;
````

#### Calculate sum of range [0,10]

```
200A;Register 0 = final i;
2100;Register 1 = i;
2201;Register 2 = increment step;
2300;Register 3 = current sum;
D116;Start of loop;
5313
5112
B008;End of loop;
0000
0000
0000
C000
```
