import './Filter.css'
const Filter = ({ filter, setFilter, setSort }) => {
    return (
        <div className="filtro">
            <h2>Filtrar:</h2>
            <div className="filter-option">
                <div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">Todas</option>
                        <option value="Completed">Completas</option>
                        <option value="Incompleted">Incompletas</option>
                    </select>
                </div>
                <div className='container-btns-filter'>
                    <button className='btn-filter' onClick={() => setSort("Asc")}>Asc</button>
                    <button className='btn-filter' onClick={() => setSort("Desc")}>Desc</button>
                </div>
            </div>
        </div>
    )
}

export default Filter