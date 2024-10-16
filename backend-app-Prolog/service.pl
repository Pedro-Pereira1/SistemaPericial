% Bibliotecas HTTP
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).

% Bibliotecas JSON
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).
:- use_module(library(http/http_open)).
:- [prolog].
:- dynamic criador/1.
:- dynamic question/3.


:-http_handler('/api/prolog/hello_world', hello_world, [method(get)]).
hello_world(Request):-
    http_parameters(Request,[]),
    cors_enable,
    Response = _{message:"Hello World"},
    atom_json_dict(JSON, Response, []),
    reply_json(JSON).

:- http_handler('/api/prolog/test', test, [method(post)]).
test(Request) :-
    http_read_json_dict(Request, DictIn),
    Alert = DictIn.get(alert),
    Response = DictIn.get(response),
    Question = 'What is your favorite color?',
    Type = 'multiple_choice',
    PossibleResponses = ['Red', 'Blue', 'Green'],
    asserta(question(Question, Type, PossibleResponses)),
    DictOut = _{
        question: Question,
        type: Type,
        possible_responses: PossibleResponses,
        response:Response,
        alert:Alert
    },
    reply_json(DictOut).

:- http_handler('/api/prolog/handler', handle_question, [method(post)]).
handle_question(Request):-
    cors_enable,
    http_read_json_dict(Request, JSONDict),
    create_fact_from_json(JSONDict, Fact),
    create_dynamic_fact(Fact, _),
    !,
    (
        arranca_motor,
        ultimo_facto(N1),
        facto(N1,_)
        ;
        ultimo_facto(N1),
        facto(N1,_)
    ),
    (
        facto(N1,questao(Question, Type, PossibleResponses, ParameterNumber)),
        DictOut = _{
            question: Question,
            type: Type,
            possible_responses: PossibleResponses,
            parameter_number: ParameterNumber
        }
        ;
        facto(N1,conclusao(Conlcusao)),
        DictOut = _{
            conclusion: Conlcusao
        }
    )
    ,
    reply_json(DictOut).


create_fact_from_json(JSONDict, Fact) :-
    FactNameStr = JSONDict.get(fact_name),
    atom_string(FactName, FactNameStr),
    Variables = JSONDict.get(variables),
    Fact =.. [FactName | Variables].

test_post_request(Question, Type, PossibleResponses):-
    trace,
    create_dynamic_fact(criador("conhecido"), N),
    consult("regras.txt"),
    trace,
    arranca_motor,
    facto(N,questao(Question, Type, PossibleResponses)).