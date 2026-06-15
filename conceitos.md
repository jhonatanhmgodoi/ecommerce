# API Gateway — Conceitos

Ponto de entrada único para clientes externos. Em vez de falar diretamente com cada microserviço, o cliente envia tudo ao gateway, que roteia, protege e enriquece as requisições.

```text
Cliente → API Gateway → [Auth] → [Users] → [Orders] → ...
```

---

## Vantagens

| Responsabilidade | O que faz |
|---|---|
| **Roteamento** | Direciona requisições para o serviço correto com base em path, host ou headers |
| **Autenticação / Autorização** | Valida tokens (JWT, OAuth) e sessões antes de chegar ao backend |
| **Rate limiting** | Controla taxa de requisições por IP, usuário ou API key |
| **Load balancing** | Distribui carga entre instâncias do mesmo serviço |
| **Logging e observabilidade** | Registra requisições, métricas e traces centralizados |
| **CORS** | Configura políticas de origem cruzada em um só lugar |
| **Transformações** | Adapta request/response (headers, body, versionamento de API) |

> **Por que centralizar?** Evita repetir auth, CORS e rate limit em cada microserviço — o backend fica focado em regra de negócio.

---

## Padrões de projeto (neste projeto)

| Padrão | Papel no gateway |
|---|---|
| **Proxy** | Encaminha requisições ao serviço de destino sem expor a topologia interna |
| **Facade** | Simplifica a interface: o cliente vê uma API unificada, não dezenas de serviços |
| **Decorator** | Adiciona comportamentos em camadas (auth, log, cache) sem alterar o handler core |
| **Chain of Responsibility** | Pipeline de middlewares — cada etapa processa e passa adiante ou interrompe |

```text
Request → [Auth] → [RateLimit] → [Log] → [Proxy] → Serviço
```

---

## Nem tudo são flores — dificuldades

| Risco | Detalhe |
|---|---|
| **Single point of failure (SPOF)** | Se o gateway cair, toda a API fica indisponível. Mitigação: múltiplas instâncias + health checks |
| **Latência adicional** | Toda requisição passa por um "pedágio" antes do serviço. Mitigação: gateway leve, cache, edge |
| **Complexidade operacional** | Configuração de rotas, plugins e políticas cresce com o número de serviços |
| **Versionamento de API** | Gerenciar v1/v2, depreciação e compatibilidade exige disciplina e documentação |

---

## Quando faz sentido usar

- Múltiplos microserviços expostos externamente
- Necessidade de auth, rate limit e CORS centralizados
- Clientes mobile/web que precisam de uma API unificada

## Quando reconsiderar

- Aplicação monolítica simples com poucas rotas
- Latência crítica em caminhos internos (serviço-a-serviço) — aí prefira comunicação direta ou service mesh

---

## Glossário rápido

- **Upstream** — serviço de destino para onde o gateway encaminha
- **Downstream** — cliente que consome a API
- **Middleware** — função no pipeline que processa request/response
- **Reverse proxy** — recebe requisições externas e repassa internamente
