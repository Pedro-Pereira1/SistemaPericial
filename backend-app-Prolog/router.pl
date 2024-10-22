% Bibliotecas HTTP
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_open)).
:- [service].

:- set_setting(http:cors, [*]).


startServer(Port) :-
    http_server(http_dispatch, [port(Port)]),
    consult("regras.txt"),
    asserta(port(Port)).

stopServer :-
    retract(port(Port)),
    http_stop_server(Port, _).
