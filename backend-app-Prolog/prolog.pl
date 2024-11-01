% Vers�o preparada para lidar com regras que contenham nega��o (nao)
% Metaconhecimento
% Usar base de conhecimento veIculos2.txt
% Explica��es como?(how?) e porque n�o?(whynot?)

:-op(220,xfx,entao).
:-op(35,xfy,se).
:-op(240,fx,regra).
:-op(500,fy,nao).
:-op(600,xfy,e).

:-dynamic justifica/3.
:-dynamic facto/2.
:-dynamic ultimo_facto/1.

carrega_bc:-
		write('NOME DA BASE DE CONHECIMENTO (terminar com .)-> '),
		read(NBC),
		consult(NBC).

arranca_motor:-	facto(N,Facto),
		facto_dispara_regras1(Facto, LRegras),
		dispara_regras(N, Facto, LRegras),
		ultimo_facto(N).

facto_dispara_regras1(Facto, LRegras):-
	facto_dispara_regras(Facto, LRegras),
	!.
facto_dispara_regras1(_, []).

dispara_regras(N, Facto, [ID|LRegras]):-
	regra ID se LHS entao RHS,
	facto_esta_numa_condicao(Facto,LHS),
	verifica_condicoes(LHS, LFactos),
	member(N,LFactos),
	concluir(RHS,ID,LFactos),
	!,
	dispara_regras(N, Facto, LRegras).

dispara_regras(N, Facto, [_|LRegras]):-
	dispara_regras(N, Facto, LRegras).

dispara_regras(_, _, []).

facto_esta_numa_condicao(F,[F  e _]).

facto_esta_numa_condicao(F,[avalia(F1)  e _]):- F=..[H,H1|_],F1=..[H,H1|_].

facto_esta_numa_condicao(F,[_ e Fs]):- facto_esta_numa_condicao(F,[Fs]).

facto_esta_numa_condicao(F,[F]).

facto_esta_numa_condicao(F,[avalia(F1)]):-F=..[H,H1|_],F1=..[H,H1|_].


verifica_condicoes([nao avalia(X) e Y],[nao X|LF]):- !,
	\+ avalia(_,X),
	verifica_condicoes([Y],LF).
verifica_condicoes([avalia(X) e Y],[N|LF]):- !,
	avalia(N,X),
	verifica_condicoes([Y],LF).

verifica_condicoes([nao avalia(X)],[nao X]):- !, \+ avalia(_,X).
verifica_condicoes([avalia(X)],[N]):- !, avalia(N,X).

verifica_condicoes([nao X e Y],[nao X|LF]):- !,
	\+ facto(_,X),
	verifica_condicoes([Y],LF).
verifica_condicoes([X e Y],[N|LF]):- !,
	facto(N,X),
	verifica_condicoes([Y],LF).

verifica_condicoes([nao X],[nao X]):- !, \+ facto(_,X).
verifica_condicoes([X],[N]):- facto(N,X).



concluir([cria_facto(F)|Y],ID,LFactos):-
	!,
	cria_facto(F,ID,LFactos),
	concluir(Y,ID,LFactos).

concluir([],_,_):-!.



cria_facto(F,_,_):-
	facto(_,F),!.

cria_facto(F,ID,LFactos):-
	retract(ultimo_facto(N1)),
	N is N1+1,
	asserta(ultimo_facto(N)),
	assertz(justifica(N,ID,LFactos)),
	assertz(facto(N,F)).
	%write('Foi concluido o facto numero '),write(N),write(' -> '),write(F),get0(_),!.



avalia(N,P):-	P=..[Functor,Entidade,Operando,Valor],
		P1=..[Functor,Entidade,Valor1],
		facto(N,P1),
		compara(Valor1,Operando,Valor).

compara(V1,==,V):- V1==V.
compara(V1,\==,V):- V1\==V.
compara(V1,>,V):-V1>V.
compara(V1,<,V):-V1<V.
compara(V1,>=,V):-V1>=V.
compara(V1,=<,V):-V1=<V.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Visualiza��o da base de factos

mostra_factos:-
	findall(N, facto(N, _), LFactos),
	escreve_factos(LFactos).

how(How) :-
    justifica_todos(LJustificacoes),
    how_iteracao(LJustificacoes, [], How).

how_iteracao([], How, How):-!.
how_iteracao([(Facto, Regra)|L], HowAcumulado, How) :-
    ultimo_facto(N),
    Facto =:= N,
	facto(Facto, conclusao(Conclusao)),
	concatenar_lista(['Rule N.', Regra, ': ', Conclusao], Resultado),
	append(HowAcumulado, [Resultado], HowFinal),
    how_iteracao(L, HowFinal, How),!.

how_iteracao([(Facto, Regra)|L], HowAcumulado, How) :-
    facto(Facto, questao(Questao_Texto,_,_,_)),
	% Procura o numero dos factos
	Facto1_Num is Facto+1,
	Facto2_Num is Facto-1,

	%Retorna os Factos para aqueles nums
	facto(Facto1_Num, Facto1),
	facto(Facto2_Num, Facto2),

	% Retira os parâmetros para listas
	Facto1 =.. [_|P1],
	Facto2 =.. [_|P2],
	compara_parametros(P2, P1, Diferente),
	concatenar_lista(['Rule N.', Regra, ': ', Questao_Texto, ' Response: ', Diferente], Concat_String),

    append(HowAcumulado, [Concat_String], HowNovo),
    how_iteracao(L, HowNovo, How).

compara_parametros([],_,_):-!.
compara_parametros([H|L1],[H|L2],Diferente):-compara_parametros(L1,L2,Diferente).
compara_parametros([_|_],[H2|_],H2).



%why(Id,Resposta):-ultimo_facto(N),Id>N,Resposta='This fact does not exist'.
%why(Id,Resposta):-FactoNum is Id-1, FactoNum<1,Resposta='This is the first fact'.
%why(Id,Resposta):-FactoNum is Id-1, facto(FactoNum,R), term_to_atom(R, Resposta).

concatenar_lista([Unico], Unico).
concatenar_lista([Primeiro|Restante], Resultado) :-
    concatenar_lista(Restante, Parcial),
    atom_concat(Primeiro, Parcial, Resultado).

escreve_factos([I|R]):-facto(I,F), !,
	write('O facto numero '),write(I),write(' -> '),write(F),write(' e verdadeiro'),nl,
	escreve_factos(R).
escreve_factos([I|R]):-
	write('A condicaoo '),write(I),write(' e verdadeira'),nl,
	escreve_factos(R).
escreve_factos([]).

explica([I|R]):- \+ integer(I),!,explica(R).
explica([I|R]):-como(I),
		explica(R).
explica([]):-	write('********************************************************'),nl.




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Gera��o de explica��es do tipo "Porque nao"
% Exemplo: ?- whynot(classe(meu_ve�culo,ligeiro)).

whynot(Facto):-
	whynot(Facto,1).

whynot(Facto,_):-
	facto(_, Facto),
	!,
	write('O facto '),write(Facto),write(' nao e falso!'),nl.
whynot(Facto,Nivel):-
	encontra_regras_whynot(Facto,LLPF),
	whynot1(LLPF,Nivel).
whynot(nao Facto,Nivel):-
	formata(Nivel),write('Porque:'),write(' O facto '),write(Facto),
	write(' E verdadeiro'),nl.
whynot(Facto,Nivel):-
	formata(Nivel),write('Porque:'),write(' O facto '),write(Facto),
	write(' nao esta definido na base de conhecimento'),nl.

%  As explica��es do whynot(Facto) devem considerar todas as regras que poderiam dar origem a conclus�o relativa ao facto Facto

encontra_regras_whynot(Facto,LLPF):-
	findall((ID,LPF),
		(
		regra ID se LHS entao RHS,
		member(cria_facto(Facto),RHS),
		encontra_premissas_falsas(LHS,LPF),
		LPF \== []
		),
		LLPF).

whynot1([],_).
whynot1([(ID,LPF)|LLPF],Nivel):-
	formata(Nivel),write('Porque pela regra '),write(ID),write(':'),nl,
	Nivel1 is Nivel+1,
	explica_porque_nao(LPF,Nivel1),
	whynot1(LLPF,Nivel).

encontra_premissas_falsas([nao X e Y], LPF):-
	verifica_condicoes([nao X], _),
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([X e Y], LPF):-
	verifica_condicoes([X], _),
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([nao X], []):-
	verifica_condicoes([nao X], _),
	!.
encontra_premissas_falsas([X], []):-
	verifica_condicoes([X], _),
	!.
encontra_premissas_falsas([nao X e Y], [nao X|LPF]):-
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([X e Y], [X|LPF]):-
	!,
	encontra_premissas_falsas([Y], LPF).
encontra_premissas_falsas([nao X], [nao X]):-!.
encontra_premissas_falsas([X], [X]).
encontra_premissas_falsas([]).

explica_porque_nao([],_).
explica_porque_nao([nao avalia(X)|LPF],Nivel):-
	!,
	formata(Nivel),write('A condicao nao '),write(X),write(' e falsa'),nl,
	explica_porque_nao(LPF,Nivel).
explica_porque_nao([avalia(X)|LPF],Nivel):-
	!,
	formata(Nivel),write('A condicao '),write(X),write(' e falsa'),nl,
	explica_porque_nao(LPF,Nivel).
explica_porque_nao([P|LPF],Nivel):-
	formata(Nivel),write('A premissa '),write(P),write(' e falsa'),nl,
	Nivel1 is Nivel+1,
	whynot(P,Nivel1),
	explica_porque_nao(LPF,Nivel).

formata(Nivel):-
	Esp is (Nivel-1)*5, tab(Esp).

create_dynamic_fact(Fact, N):-
	findall(N, facto(N, _), LFactos),
	length(LFactos, NFactos),
	N1 is NFactos+1,
	(ultimo_facto(N);assertz(ultimo_facto(0))),
	retract(ultimo_facto(N)),
	assertz(facto(N1,Fact)),
	asserta(ultimo_facto(N1)).


justifica_todos(LJustifica):-
	findall((N,Regras), justifica(N,Regras,_), LJustifica).


whyNot(Texto,WhyNot):-
	findall(LHS, (regra _ se [LHS] entao [cria_facto(conclusao(Texto))]), L),
	whyNot_each(L,[],WhyNot).

whyNot(_,WhyNot):-WhyNot = "This conclusion does not exist".

whyNot_each([],FL,FL).

whyNot_each([LHS|L],FL,Rules1):-
	whyNot_each2(LHS,[],Rules),
	whyNot_each(L,[Rules|FL],Rules1).
	
whyNot_each2(LHS,List,Rules):-
	LHS =.. [_|P],
	replace_last_non_null(P, Variables),
	Fact =.. [alert | Variables],
	regra _ se [Fact] entao [cria_facto(questao(RHS,_,_,_))],
	whyNot_each2(Fact, [RHS|List], Rules).
whyNot_each2(_,Rules,Rules).

replace_last_non_null(P,Variables):-
	reverse_list(P, X),
	replace_first_non_null(X, "null", Y),
	reverse_list(Y, Variables).

reverse_list(List, Reversed) :-
    reverse_helper(List, [], Reversed).

reverse_helper([], Acc, Acc).

reverse_helper([H | T], Acc, Reversed) :-
    reverse_helper(T, [H | Acc], Reversed).

replace_first_non_null([], _NewValue, []).

replace_first_non_null([H | T], NewValue, [NewValue | T]) :-
    H \= "null".

replace_first_non_null(["null" | T], NewValue, ["null" | NewTail]) :-
    replace_first_non_null(T, NewValue, NewTail).

all_conclusions_to_alert(Alert, Conclusions):-
	findall((LHS,Texto), (regra _ se [LHS] entao [cria_facto(conclusao(Texto))]), L),
	all_conclusions_to_alert1(Alert, L, Conclusions).
	

all_conclusions_to_alert1(_, [],[]).
all_conclusions_to_alert1(Alert, [(H,Texto)|L],[Texto|L1]):-
	H =.. [_|P],
	contains(Alert, P),
	all_conclusions_to_alert1(Alert, L,L1),
	\+contains(Texto, L1).

all_conclusions_to_alert1(Alert, [_|L], L1):-
	all_conclusions_to_alert1(Alert, L,L1).

% Base case: An empty list does not contain any element.
contains(_, []):- 
    false.

contains(Element, [Element|_]) :- 
    true.

contains(Element, [_|Tail]) :- 
    contains(Element, Tail).
	

why(Questao,Alert,Why):-
	findall(LHS, regra _ se [LHS] entao [cria_facto(questao(Questao,_,_,_))], Questions),
	why_question_from_alert(Questions, Alert, Facts),
	all_conclusions_to_alert2(Alert, Conclusions),
	why_each_question(Facts,Conclusions,L),
	get_conclusions_text(L, Why).

why_question_from_alert([],_,[]).
why_question_from_alert([H|L1],Alert,[H|L2]):-
	H=.. [_|P],
	why_question_from_alert_get_head(P,H1),
	H1 == Alert,
	why_question_from_alert(L1,Alert,L2).

why_question_from_alert([_|L1],Alert,L2):-
	why_question_from_alert(L1,Alert,L2).

why_question_from_alert_get_head([H|_],H).

why_each_question([],_,[]).
why_each_question([Question_Fact|L],Conclusions, [Conclusions2|FL]):-
	why_each_conclusion(Conclusions, Question_Fact, Conclusions2),
	why_each_question(L, Conclusions, FL).

why_each_conclusion([],_,[]).
why_each_conclusion([Conclusion|L1],Question_Fact,[Conclusion|L2]):-
	is_it_conclusion(Conclusion, Question_Fact),
	why_each_conclusion(L1, Question_Fact, L2).
why_each_conclusion([_|L1],Question_Fact,L2):-
	why_each_conclusion(L1,Question_Fact,L2).

is_it_conclusion(Conclusion, Question_Fact):-
	is_it_conclusion1(Conclusion, Question_Fact).

is_it_conclusion1(Conclusion, Question_Fact):-
	Conclusion =.. [_|P],
	replace_last_non_null(P, Variables),
	Fact =.. [alert | Variables],
	Fact \= Question_Fact,!,
	regra _ se [Fact] entao [cria_facto(questao(_,_,_,_))],
	is_it_conclusion1(Fact, Question_Fact).

is_it_conclusion1(Conclusion, _):-
	Conclusion =.. [_|P],
	replace_last_non_null(P, Variables),
	Fact =.. [alert | Variables],!,
	regra _ se [Fact] entao [cria_facto(questao(_,_,_,_))],!.

is_it_conclusion1(_, _):-
	false.

all_conclusions_to_alert2(Alert, Conclusions):-
	findall((LHS,Texto), (regra _ se [LHS] entao [cria_facto(conclusao(Texto))]), L),
	all_conclusions_to_alert3(Alert, L, Conclusions).
	
all_conclusions_to_alert3(_, [],[]).
all_conclusions_to_alert3(Alert, [(H,_)|L],[H|L1]):-
	H =.. [_|P],
	contains(Alert, P),
	all_conclusions_to_alert3(Alert, L,L1).

all_conclusions_to_alert3(Alert, [_|L], L1):-
	all_conclusions_to_alert3(Alert, L,L1).

get_conclusions_text([], []).
get_conclusions_text([Conclusions_list|L1],[Response|L2]):-
	get_conclusions_text1(Conclusions_list,Response),
	get_conclusions_text(L1, L2).

get_conclusions_text1([],[]).
get_conclusions_text1([Conclusion_Fact|L1],[Conclusion|L2]):-
	regra _ se [Conclusion_Fact] entao [cria_facto(conclusao(Conclusion))],
	get_conclusions_text1(L1,L2).