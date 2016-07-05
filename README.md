# dna-analyser
Analyses DNA sequences

#Changelog

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

#Future updates suggestions
- FASTA DNA text file as example and as reference for testing
- Total execution time counter

#memo for testing purposes
DNA sequence: http://www.ncbi.nlm.nih.gov/nuccore/NC_000074.6?report=genbank&from=3150922&to=3279649&strand=true

Bioinformatics.org CpG islands finder : http://www.bioinformatics.org/sms2/cpg_islands.html
