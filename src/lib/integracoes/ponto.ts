// Adaptador da API de ponto.
// Único arquivo que conhece o formato do fornecedor. Devolve sempre o formato interno
// (Marcacao). Para trocar de fornecedor, mude só este arquivo.
// Roda no servidor (Route Handler): o token nunca chega ao navegador.

import exemplo from "../../../docs/marcacoes-exemplo.json";

/** Formato interno de uma marcação de ponto. Horários "HH:MM" ou null. */
export type Marcacao = {
  cpf: string;
  data: string;
  entrada: string | null;
  saidaIntervalo: string | null;
  voltaIntervalo: string | null;
  saida: string | null;
};

export type ResultadoMarcacoes = {
  marcacoes: Marcacao[];
  /** "api" quando veio do fornecedor; "exemplo" quando usamos os dados de exemplo */
  fonte: "api" | "exemplo";
  aviso: string | null;
};

// Formato da API de demonstração (e o que precisa ser traduzido num fornecedor real)
type MarcacaoDoFornecedor = {
  cpf: string;
  data: string;
  entrada: string | null;
  saida_intervalo: string | null;
  volta_intervalo: string | null;
  saida: string | null;
};

function traduzir(m: MarcacaoDoFornecedor): Marcacao {
  return {
    cpf: String(m.cpf).replace(/\D/g, ""),
    data: m.data,
    entrada: m.entrada,
    saidaIntervalo: m.saida_intervalo,
    voltaIntervalo: m.volta_intervalo,
    saida: m.saida,
  };
}

export async function buscarMarcacoes(data: string): Promise<ResultadoMarcacoes> {
  const url = process.env.PONTO_API_URL;
  const token = process.env.PONTO_API_TOKEN;

  if (!url || !token) {
    return {
      marcacoes: (exemplo as MarcacaoDoFornecedor[]).map(traduzir),
      fonte: "exemplo",
      aviso:
        "PONTO_API_URL e PONTO_API_TOKEN não configuradas na Vercel. Mostrando dados de exemplo.",
    };
  }

  try {
    const resposta = await fetch(`${url.replace(/\/$/, "")}/api/marcacoes?data=${data}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!resposta.ok) {
      throw new Error(`API de ponto respondeu ${resposta.status}`);
    }
    const lista = (await resposta.json()) as MarcacaoDoFornecedor[];
    return { marcacoes: lista.map(traduzir), fonte: "api", aviso: null };
  } catch (e) {
    return {
      marcacoes: (exemplo as MarcacaoDoFornecedor[]).map(traduzir),
      fonte: "exemplo",
      aviso: `Não foi possível falar com a API de ponto (${e instanceof Error ? e.message : String(e)}). Mostrando dados de exemplo.`,
    };
  }
}
