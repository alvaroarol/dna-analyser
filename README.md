# dna-analyser
Analyses DNA sequences

#Changelog

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
