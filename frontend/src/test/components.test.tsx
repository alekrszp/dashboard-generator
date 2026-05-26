import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '../components/StatCard'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import DataTable from '../components/DataTable'

describe('StatCard', () => {
  it('renderiza label e valor', () => {
    render(<StatCard label="Dashboards" value={42} />)
    expect(screen.getByText('Dashboards')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('renderiza mensagem', () => {
    render(<EmptyState message="Nenhum dado" />)
    expect(screen.getByText('Nenhum dado')).toBeInTheDocument()
  })

  it('renderiza botão de ação quando fornecido', () => {
    render(<EmptyState message="Vazio" actionLabel="Criar" onAction={() => {}} />)
    expect(screen.getByText('Criar')).toBeInTheDocument()
  })
})

describe('ConfirmModal', () => {
  it('exibe mensagem e botões', () => {
    render(<ConfirmModal message="Tem certeza?" onConfirm={() => {}} onCancel={() => {}} />)
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })
})

describe('DataTable', () => {
  it('renderiza colunas e linhas', () => {
    render(<DataTable columns={['Nome', 'Valor']} rows={[{ Nome: 'Alpha', Valor: 10 }]} />)
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })
})