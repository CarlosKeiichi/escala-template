# API de ponto de demonstração · Vila Tempero

API fictícia usada na aula para simular o sistema de ponto do restaurante. Ela devolve as
marcações (batidas) de ponto de 8 funcionários fictícios. Serve para construir e testar a
integração; depois, troca-se pela API do fornecedor real mexendo só no adaptador.

## Acesso
- URL base: valor da variável de ambiente `PONTO_API_URL` (ex.: `https://api-ponto-demo.vercel.app`)
- Token: valor da variável `PONTO_API_TOKEN`, enviado no cabeçalho `Authorization: Bearer <token>`
- Sem token ou com token errado, a API responde `401` com `{"erro":"Token inválido"}`
- As chamadas devem ser feitas no servidor (Route Handler), nunca no navegador

## GET /api/funcionarios
Lista os funcionários cadastrados no ponto.

```json
[
  { "id": "f01", "nome": "Ana Souza", "cpf": "12345678901", "funcao": "Salão", "telefone": "(11) 91234-0001" }
]
```

A ligação com o funcionário do nosso sistema é feita pelo campo `cpf` (só dígitos, 11 caracteres).

## GET /api/marcacoes?data=AAAA-MM-DD
Marcações de um dia. Também aceita um período: `?inicio=AAAA-MM-DD&fim=AAAA-MM-DD` (máximo 31 dias).

```json
[
  {
    "cpf": "12345678901",
    "data": "2026-11-20",
    "entrada": "10:55",
    "saida_intervalo": "15:35",
    "volta_intervalo": "17:55",
    "saida": "23:35"
  }
]
```

- Horários no formato `HH:MM`, horário local, ou `null` quando não houve a batida
- Quem faltou simplesmente não aparece na lista daquele dia
- Quem trabalhou só um turno tem `saida_intervalo` e `volta_intervalo` em `null`
- Segunda-feira o restaurante fictício não abre: lista vazia

## Regras da conferência (o que o sistema faz com esses dados)
Compara a escala planejada do dia com as marcações:
- No horário: entrada até 10 minutos depois do início do turno (tolerância em `configuracoes.tolerancia_atraso_minutos`)
- Atrasado: entrada depois da tolerância; mostrar os minutos de atraso
- Faltou: funcionário escalado sem nenhuma marcação no dia
- Hora extra: saída mais de 30 minutos depois do fim do turno (`configuracoes.hora_extra_minutos`)
- Não escalado: bateu ponto mas não estava na escala do dia

## Situações plantadas
Todo dia aberto tem, de propósito, um atraso, uma falta e uma hora extra entre os funcionários
que trabalham naquele dia, para a tela de conferência ter o que mostrar.

## Se a API não responder
Use `docs/marcacoes-exemplo.json` como dados de exemplo e avise na tela que são dados de exemplo.
