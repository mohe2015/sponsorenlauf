#lang racket

(with-output-to-file "test.csv" #:mode 'text #:exists 'replace
  (lambda ()
    (printf "Name,Klasse,Jahrgang~n")
    (for ([i (in-range 1 1000)])
      (let ((name-id (random 1 1000000))
            (grade (random 5 13))
            (class-id (random 1 5)))
      (printf "Peter~a,~sG~s,~s~n" name-id grade class-id grade)))))