
const Filter = ({ filter, setFilter, setSort }) => {
    return (
        <div className="filtro">
            <h2>Filtrar:</h2>
            <div className="filter-option">
                <div>
                    <p>Status:</p>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="All">Todas</option>
                        <option value="Completed">Completas</option>
                        <option value="Incompleted">Incompletas</option>
                    </select>
                </div>
                <div>
                    <p>
                        Ordem alfabetica:
                    </p>
                    <button onClick={() => setSort("Asc")}>Asc</button>
                    <button onClick={() => setSort("Desc")}>Desc</button>

                </div>
            </div>
        </div>
    )
}

export default Filter