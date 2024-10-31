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

:- http_handler('/api/prolog/handler', handle_question, []).
handle_question(Request):-
    option(method(options), Request),
    !,
    cors_enable(Request,[methods([post])]),
    format('Content-type: application/json\r\n'),
    format('~n'). 

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
            question: _{
                text: Question,
                type: Type,
                possibleAnswers: PossibleResponses
            },
            parameterNumber: ParameterNumber,
            currentStep: "question"
        }
        ;
        facto(N1,conclusao(Conlcusao)),
        DictOut = _{
            conclusion: _{
                description: Conlcusao
            },
            currentStep: "conclusion"
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

:- http_handler('/api/prolog/reset', handle_reset, []).
handle_reset(Request):-
    option(method(options), Request),
    !,
    cors_enable(Request,[methods([get])]),
    format('Content-type: application/json\r\n'),
    format('~n'). 

handle_reset(_Request) :-
    cors_enable,
    retractall(facto(_, _)),
    retractall(justifica(_,_,_)),
    reply_json(_{status: 'success', message: 'Database reset.'}).

:- http_handler('/api/prolog/why', handle_why, []).
handle_why(Request):-
    option(method(options), Request),
    !,
    cors_enable(Request,[methods([get])]),
    format('Content-type: application/json\r\n'),
    format('~n').
handle_why(Request) :-
    cors_enable,
    http_parameters(Request, [
        id(Id, [optional(true), default('none')])
    ]),
    atom_number(Id, Num),
    why(Num,Why),
    reply_json(_{status: 'success', message: Why}).

handle_why(_Request) :-
    cors_enable,
    reply_json(_{status: 'error', message: 'This fact does not exist.'}).


:- http_handler('/api/prolog/how', handle_how, []).
handle_how(Request):-
    option(method(options), Request),
    !,
    cors_enable(Request,[methods([get])]),
    format('Content-type: application/json\r\n'),
    format('~n').
handle_how(_Request) :-
    cors_enable,
    how(How),
    reply_json(How).

handle_how(_Request) :-
    cors_enable,
    reply_json(_{status: 'error', message: 'This fact does not exist.'}).

:- http_handler('/api/prolog/not', handle_why_not, []).
handle_why_not(Request):-
    option(method(options), Request),
    !,
    cors_enable(Request,[methods([get])]),
    format('Content-type: application/json\r\n'),
    format('~n').
handle_why_not(Request) :-
    cors_enable,
    http_parameters(Request, [
        conclusion(Conclusion, [optional(true), default('none')])
    ]),
    atom_string(Conclusion, C),
    whyNot(C, WhyNot),
    reply_json(_{status: 'success', message: WhyNot}).


handle_why_not(_Request) :-
    cors_enable,
    reply_json(_{status: 'error', message: 'This conclusion does not exist.'}).

:- http_handler('/api/prolog/conclusions', handle_conclusions, []).
handle_conclusions(Request):-
    option(method(options), Request),
    !,
    cors_enable(Request,[methods([get])]),
    format('Content-type: application/json\r\n'),
    format('~n').
handle_conclusions(Request) :-
    cors_enable,
    http_parameters(Request, [
        alert(Alert, [optional(true), default('none')])
    ]),
    atom_string(Alert, AlertS),
    all_conclusions_to_alert(AlertS,Conclusions),
    reply_json(_{status: 'success', message:Conclusions}).
handle_conclusions(_Request) :-
    cors_enable,
    reply_json(_{status: 'error', message: 'This alert does not exist.'}).

convert_to_strings_list([],[]).
convert_to_strings_list([H|L1], [C|L2]):-
    atom_string(H, C),
    convert_to_strings_list(L1,L2).


