interface ExampleModalProps {
  onClose: () => void
}

export default function ExampleModal({ onClose }: ExampleModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'rgba(13,25,45,0.98)',
        border: '1px solid rgba(100,160,255,0.2)',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '480px', width: '100%',
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #1565c0, #4d9de0)', flexShrink: 0 }} />
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#e8eaf0', margin: 0 }}>
              Como preencher os dados
            </p>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#7a8fa6', fontSize: '18px', lineHeight: 1,
            }}>
              ×
            </button>
          </div>

          <p style={{ fontSize: '13px', color: '#7a8fa6', marginBottom: '1rem', lineHeight: '1.6' }}>
            A primeira linha são os <span style={{ color: '#4d9de0' }}>nomes das colunas</span>. As linhas seguintes são os <span style={{ color: '#4d9de0' }}>dados</span>. Cada coluna deve ter um tipo consistente — texto ou número.
          </p>

          <p style={{ fontSize: '12px', color: '#7a8fa6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Exemplo — Vendas mensais
          </p>

          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '300px' }}>
              <thead>
                <tr>
                  {['Mês', 'Vendas', 'Lucro'].map(col => (
                    <th key={col} style={{
                      textAlign: 'left', padding: '7px 12px',
                      background: 'rgba(77,157,224,0.1)',
                      color: '#4d9de0', fontWeight: 500,
                      borderBottom: '1px solid rgba(100,160,255,0.2)',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Janeiro', '15000', '4500'],
                  ['Fevereiro', '18000', '5400'],
                  ['Março', '22000', '6600'],
                  ['Abril', '19500', '5850'],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: '7px 12px', color: '#c8cdd6',
                        borderBottom: '1px solid rgba(100,160,255,0.08)',
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'rgba(77,157,224,0.08)', border: '1px solid rgba(77,157,224,0.2)', borderRadius: '8px', padding: '12px', marginBottom: '1rem' }}>
            <p style={{ fontSize: '12px', color: '#7a8fa6', margin: 0, lineHeight: '1.6' }}>
              <span style={{ color: '#4d9de0', fontWeight: 500 }}>Dica:</span> Use colunas numéricas para gráficos de barra, linha e pizza. Use uma coluna de texto como eixo X — como mês, categoria ou nome.
            </p>
          </div>

          <p style={{ fontSize: '12px', color: '#7a8fa6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Outros exemplos de datasets
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
            {[
              { title: 'Temperatura por cidade', cols: 'Cidade, Temp. Média, Temp. Máxima' },
              { title: 'Alunos por curso', cols: 'Curso, Alunos, Aprovados, Reprovados' },
              { title: 'Produtos mais vendidos', cols: 'Produto, Quantidade, Receita' },
            ].map(ex => (
              <div key={ex.title} style={{
                padding: '10px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(100,160,255,0.1)',
              }}>
                <p style={{ fontSize: '13px', color: '#e8eaf0', margin: 0 }}>{ex.title}</p>
                <p style={{ fontSize: '12px', color: '#3d5068', marginTop: '3px' }}>{ex.cols}</p>
              </div>
            ))}
          </div>

          <button onClick={onClose} style={{
            width: '100%', padding: '9px',
            background: 'linear-gradient(90deg, #1565c0, #1976d2)',
            color: '#fff', border: 'none', borderRadius: '6px',
            fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          }}>
            Entendi
          </button>

        </div>
      </div>
    </div>
  )
}