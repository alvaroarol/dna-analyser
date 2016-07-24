# dna-analyser
Analyses DNA sequences

#Changelog

24/07/2016
- Fixed wrong nucleotide molecular weight values
- Added a PCR primer analysis tool

22/07/2016
- Added nucleotide pairs frequencies in the main analysis
- New section in "Help" page for the new contents from the tools on the right columns
- Added a "working" cursor while the main analyse is running, as well as the pointer cursor when hovering buttons
- Minor design tweaks

21/07/2016
- Added quick tools in a right-side column
- Added a toggle button to hide the left and right columns
- Slight design tweaks

19/07/2016
- More appealing design
- Graphs longer than the div itself are now displayed un-zoomed to fit the div. Click on the image to zoom
- Fixed bug with frequency graph coordinates corruption on IE

18/07/2016
- Added "select all" and "unselect all" options buttons
- Added "about" section and "help" page
- Further design tweaks

17/07/2016
- Improved page design
- Frequencies graphs now shows highest value in red
- Fixed a few bugs in the graphics function

16/07/2016
- Added graphs to the nucleotide and codon frequencies for a better visualisation
- Added option to order histogram bars by decreasing value

15/07/2016
- Fixed "Download to html file" not working on Firefox because of inexistent click() function on <a> elements

13/07/2016
- Added possibility to save results to an html file
- Bundled the js files in a separate folder and renamed dna-analyser.js to main.js to avoid confusions

11/07/2016
- Changed the "Options" menu to be on the same main page instead of opening a new window/tab

09/07/2016
- Added reverse, complement and reverse-complement sequences
- Warns you if remaining localStorage space is insufficient to save results

08/07/2016
- Added an options menu to restrict which functions should be ran

06/07/2016
- Added the possibility to load an example sequence or to load a sequence from a local text file
- Added a timer for execution time

05/07/2016 - hugocartwright ( https://github.com/hugocartwright )
- Optimised various functions in dna-functions.js
- Moved save and load localstorage functions to loadsave.js
- Moved formatSequence function to dna-alayser.js where most display formatting is going on

04/07/2016
- Added the possibility to save results locally for later viewing

29/06/2016
- Made the analysis functions return a more abstract result
- Changed the way everything is displayed on the page so that most DOM elements are fixed instead of dynamic for an easier manipulation
- As a consequence of both, rewrote the javascript part that is in charge of putting the results on the page
- Simplified CSS

24/06/2016
- Put the analysis functions on a separate js file
- Changed amino-acid notation to 1-letter
- CpG islands intervals that are successive are put together
- Better presentation of the sequences with indexes for each line and monospace font

23/06/2016
- Added CpG islands detection, most frequent codon and molecular weight
- Cleaner code using objects instead of arrays where relevant
- Better presentation of results

#memo for testing purposes
DNA sequence: http://www.ncbi.nlm.nih.gov/nuccore/NC_000074.6?report=genbank&from=3150922&to=3279649&strand=true

Bioinformatics.org CpG islands finder : http://www.bioinformatics.org/sms2/cpg_islands.html
