import React, {useState, useEffect, useContext, useMemo} from 'react';
import AuthenticationContext from '../components/auth/AuthenticationContext';
import axios from "axios"
import {useTable, useSortBy, useGlobalFilter, useFilters, usePagination} from "react-table"
import GlobalFilter from '../components/ReactTableFilters/GlobalFilter';
import ColumnFilter from '../components/ReactTableFilters/ColumnFilter';
import SelectFilter from '../components/ReactTableFilters/SelectFilter';
import NumberRangeFilter from '../components/ReactTableFilters/NumberRangeFilter';
import DateRangeColumnFilter from '../components/ReactTableFilters/DateRangeFilter';
import TransactionChart from '../components/ApexCharts/TransactionChart';
import Plaid from '../components/AssetBudget/TransactionPlaid';
import Sankey from '../components/ApexCharts/Sankey';
import CSV from "../components/AssetBudget/CSV"

import './Budget/AssetBudgetTransaction.css'

export default function Transactions() {

    const [addStatus, setAddStatus] = useState(0)
    const {id} = useContext(AuthenticationContext)
    const [transactionData, setTransactionData] = useState([])
    const data = useMemo(()=> transactionData, [transactionData])
    const [chartsReady, setChartsReady] = useState(false)

    const columns = useMemo(() => [
      {
        Header: 'Date',
        accessor: 'date', // accessor is the "key" in the data
        sortType: "basic",
        Filter: DateRangeColumnFilter,
        filter: "dateBetween"
      },
      {
        Header: 'Merchant',
        accessor: 'name',
        sortType: "basic",
        Filter: ColumnFilter
      },{
        Header: 'Amount',
        accessor: 'amount', // accessor is the "key" in the data
        sortType: "basic",
        Filter: NumberRangeFilter,
        filter: "between"
      },
      {
        Header: 'Bank Name',
        accessor: 'bankname',
        sortType: "basic",
        Filter: SelectFilter,
        filter: "includes"
      },{
        Header: 'Category',
        accessor: 'category', // accessor is the "key" in the data
        sortType: "basic",
        Filter: SelectFilter,
        filter: "includes"
      },], [])

    useEffect(() => {
        async function getUserandSetTransactionData() {
            let {data} = await axios.get(`/api/user/${id}/transaction`, )   
            setTransactionData(data)
        }
        getUserandSetTransactionData()
        setAddStatus(0)
        setChartsReady(true)
    }, [addStatus, id])

//  This is for the dates function
    function dateBetweenFilterFn(rows, id, filterValue) {
      let startingDate = filterValue[0];
      let endDate = filterValue[1];
      console.log(rows, id, filterValue)
          if (endDate || startingDate) {
            return rows.filter(r => {
              var time = r.values[id]
              if (endDate && startingDate) {return (time >= startingDate && time <= endDate)} 
              else if (startingDate){  return (time >= startingDate) } 
              else if (endDate){ return (time <= endDate) }
              else return null
            })} else {return rows}
      // });
    }
    dateBetweenFilterFn.autoRemove = val => !val;
    const filterTypes = React.useMemo(
      () => ({
          // Add a new fuzzyTextFilterFn filter type.
          dateBetween: dateBetweenFilterFn,   /*<- LIKE THIS*/
      }),
      []
    );


    // adding sorting feature into 
    const tableInstance = useTable({columns, data, filterTypes}, useFilters, useGlobalFilter,  useSortBy, usePagination)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage, // function
        pageCount,
        prepareRow,
        state,
        setGlobalFilter,
        filteredRows,
      } = tableInstance

    // by console.log(tableInstance), I discovered the result after filtering
    // console.log("filteredRows", filteredRows)

    // deconstruction state for filter 
    let {globalFilter, pageIndex} = state  

      return (
        transactionData ? 
        <div className='budget-container'>
          <h1 className='page-heading'>Transactions</h1>  
          <div className='budget-table'>
            <table {...getTableProps()}>
              <thead>
                {// Loop over the header rows
                headerGroups.map(headerGroup => (
                  // Apply the header row props
                  <tr className='table-title-row' {...headerGroup.getHeaderGroupProps()}>
                    {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                      // Apply the header cell props
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {// Render the header, this is really something under the hood
                        column.render('Header')}
                        <span>{column.isSorted ? column.isSortedDesc ? ' ????' : ' ????' : ''}</span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <thead className='transaction-table-xer'>
                {// Loop over the header rows
                headerGroups.map(headerGroup => (
                  // Apply the header row prop
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {// Loop over the headers in each row
                    headerGroup.headers.map(column => (
                      // Apply the header cell props without sorting
                      <th {...column.getHeaderProps()}>         
                        {column.canFilter ? column.render('Filter') : null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* Apply the table body props */}
              <tbody {...getTableBodyProps()}>
                {// Loop over the table rows
                page.map(row => {
                  // Prepare the row for display
                  prepareRow(row)
                  return (
                    // Apply the row props
                    <tr {...row.getRowProps()}>
                      {// Loop over the rows cells
                      row.cells.map(cell => {
                        // Apply the cell props
                        return (
                          <td className='transaction-table-number' style={{color: Math.sign(cell.value) === -1 ? 'red' : '#01345b'}} {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className='transaction-table-xer'>
                <tr>
                  <td>
                    <GlobalFilter globalfilter={globalFilter} setFilter={setGlobalFilter}> </GlobalFilter>
                  </td>
                  <td>
                    <button className='transaction-table-button' onClick={event => gotoPage(0)} disabled={!canPreviousPage}> {"<<"}</button>
                    <button className='transaction-table-button' onClick={event => previousPage()} disabled={!canPreviousPage}> Previous Page </button> 
                    <button className='transaction-table-button' onClick={event => nextPage()} disabled={!canNextPage}> Next Page </button>
                    <button className='transaction-table-button' onClick={event => gotoPage(pageCount - 1)} disabled={!canNextPage}> {">>"} </button> 
                  </td>
                  <td>
                    Page {" "}
                      <strong>
                        {pageIndex + 1} of {pageOptions.length}
                      </strong>
                  </td>
                  <td></td>
                  <td>
                    <label>
                      Go to page:&nbsp;
                      <input 
                        type="number" 
                        className='recurring-payment-field'
                        defaultValue={pageIndex + 1} 
                        onChange={e => {const pageNumber = e.target.value? Number(e.target.value) - 1 : 0; gotoPage(pageNumber)}}
                      />
                  </label>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className='form-div'>
            <Plaid id={id} setAddStatus={setAddStatus}> </Plaid>
            <CSV id={id} setAddStatus={setAddStatus}> </CSV>
          </div>
          {filteredRows ?
            <div className='transaction-chart-container'>
              <TransactionChart data={filteredRows}/>
              {chartsReady ?
                <Sankey userId={id} filteredData={filteredRows}/>
              : null}
            </div>
          : null}
        </div>
        : <div> Loading ...</div>
      )
     
}



