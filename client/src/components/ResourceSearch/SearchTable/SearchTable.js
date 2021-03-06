import React, {useState, useEffect} from "react"
import RatingStars from "./RatingStars"
import sortData from "./sortData"
import './SearchTable.css'

export default function SearchTable({data}) {


  const [rows, setRows] = useState(data)

  useEffect(() => {
    setRows(sortData(data))
  }, [data])

    return (
        <div className="search-table">
            <table>
                <tbody>
                  <tr className='table-title-row'><th>Name</th><th>Address</th><th>Rating</th><th>Stars</th></tr>
                  {rows.map((row) => {
                      return (                                     
                        <tr key={row.key}>
                            <td><b>{row.name}</b></td>
                            <td>
                              <div>{row.address}</div>
                              <div>{row.city}</div>
                            </td>
                            <td>
                              <div><b>{row.rating} / 5</b></div>
                              <div>{row.ratingCount} Ratings</div>
                            </td>
                            <RatingStars data={row} />
                        </tr>
                      )
                  })}                
                </tbody>
            </table>
          </div>
    )
}