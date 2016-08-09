# dna-analyser
Analyses DNA sequences

#Contributors
- alvaroarol (https://github.com/alvaroarol)
- hugocartwright (https://github.com/hugocartwright)

#Changelog

09/08/2016 - hugocartwright (see Contributors section)

Remove empty writeToHtml else clauses
Optimise formatProt option
Remove toggleAbout and use showHideButton
Replace inline onclicks with click event listeners
Remove inline onload and onchange in index.html

02/08/2016 - hugocartwright
- Modify countOccurences(sequence, reference) in dna-functions.js to accept reference argument as either array or object, therefore:
	* var nucleotidePairs a simple array
	* Create var nucleotideTriplets array to remove one-time array generation in main

- Optimise main.js
    * Modify writeToHtml(result, divId) to writeToHtml(result, divId, formattable) with formattable being an optional boolean argument indicating whether result can be formatted
	* Simplify/abstractify code executed in if(option["argument"]) blocks

- Minor tweaks in above and other files
	* Several .length tweaks

01/08/2016
- Added a "Working..." message while program is running, which is replaced by the "execution time" message once it is finished
- Minor fixes and visual tweaks


28/07/2016
- Added individual codon frequencies
- Frequencies are now always displayed by decreasing value order, including the graphs, instead of it being an option
- Fixed "Reverse-complement" option uncheck not having any effect

27/07/2016
- Fixed "Load from file" ugly button appearance
- Added "BLAST" button on main sequence analysis and PCR primer analysis, that opens a new window at NCBI's BLAST (blastn suite) with the correspondent sequence

26/07/2016
- Completed missing portions of the help page ("nucleotide par frequencies" and "PCR primer analysis" sections)

26/07/2016 - hugocartwright (see Contributors section)
- Rename and combine functions nucleotidePairFrequency, nucleotideFrequency, codonFreq to countOccurences(sequence, reference).
- Simplify reverseComplement function into "reverseSequence" and "complementSequence" functions and use DNAchars object
- Change main.js accordingly

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

05/07/2016 - hugocartwright (see Contributors section)
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
