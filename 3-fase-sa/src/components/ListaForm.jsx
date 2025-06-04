import { useState } from 'react'

function ListaForm({addLista}) {

    const [value, setValue] = useState("")
    const [categoria, setCategoria] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!value || !categoria) return;
        addLista(value, categoria);
        setValue("");
        setCategoria("");
    }
    return (
        <div className='container-form'>
            <h2>Criar Tarefa:</h2>
            <form onSubmit={handleSubmit}>
                <input value={value} type="text" placeholder='digite o titulo' onChange={(e) => setValue(e.target.value)} />
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value="">Selecione uma categoria</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Estudos">Estudos</option>
                </select>
                <button type='submit'>Criar tarefa</button>
            </form>
        </div>
    )
}

export default ListaForm