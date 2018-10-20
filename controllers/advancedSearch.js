'use strict';
let db_service = require('../utils/db_service');
let knex       = require('../utils/knex/knex');

function advancedSearch(industry,  minempl, maxempl, salvol, borough) {
    return new Promise(function (resolve, reject) {

    //TODO: BETTER TO USE Squel.Js or simial packages for sql query generation
    //Trying to install and use Knex.Js - query builder/helper

    /*

        let sql, where_clause;

        if (industry == 'null' && maxempl != 'null' && salvol != 'null') { // industry not specified
            where_clause = `WHERE "ALEMPSZ" BETWEEN ${minempl} AND ${maxempl} 
                            AND "LSALVOLDS" = '${salvol}' `;
        }
        else if (maxempl == 'null' && industry != 'null' && salvol != 'null') { // employee size not specified
            where_clause = `WHERE upper("NAICSDS") LIKE upper('%${industry}%') 
                            AND "LSALVOLDS" = '${salvol}' `;
        }
        else if (salvol == 'null' && industry != 'null' && maxempl != 'null') { // sales volume not specified
            where_clause = `WHERE upper("NAICSDS") LIKE upper('%${industry}%') 
                            AND "ALEMPSZ" BETWEEN ${minempl} AND ${maxempl} `;
        }
        else if (industry == 'null' && maxempl == 'null' && salvol != 'null') { // industry and employee size not specified
            where_clause = `WHERE "LSALVOLDS" = '${salvol}' `;
        }
        else if (industry == 'null' && salvol == 'null' && maxempl != 'null') { // industry and sales volume not specified
            where_clause = `WHERE "ALEMPSZ" BETWEEN ${minempl} AND ${maxempl} `;
        }
        else if (industry == 'null' && salvol == 'null' && maxempl == 'null') { // nothing specified 
            where_clause = ` `;
        }
        else if (industry != 'null' && salvol != 'null' && maxempl != 'null') { // everything specified 
            where_clause = `WHERE upper("NAICSDS") LIKE upper('%${industry}%') 
                            AND "ALEMPSZ" BETWEEN ${minempl} AND ${maxempl} 
                            AND "LSALVOLDS" = '${salvol}' `;
        }


        if (borough == 'null') { // borough not specified 

            sql = `SELECT 
                    id, 
                    ST_ASGeoJSON(ST_Transform(business.geom, 4326)) AS geoPoint, 
                    "CONAME", 
                    "NAICSCD", 
                    "NAICSDS", 
                    "LEMPSZCD", 
                    "LEMPSZDS", 
                    "ALEMPSZ", 
                    "PRMSICDS", 
                    "LSALVOLDS", 
                    "ALSLSVOL", 
                    "SQFOOTCD", 
                    "BE_Payroll_Expense_Code", 
                    "BE_Payroll_Expense_Range", 
                    "BE_Payroll_Expense_Description" 
                    FROM businesses_2014 as business 
                    `+where_clause+`
                 `;
        } 
        else { // borough (previously was in nymtc table) specified
            sql = `WITH county AS ( 
                        SELECT 
                        ST_Transform(geom, 4326) AS geom 
                        FROM counties as county 
                        WHERE county.name LIKE '%${borough}%' 
                        LIMIT 1 
                    ) 
                    SELECT 
                    id, 
                    ST_ASGeoJSON(ST_Transform(business.geom, 4326)) AS geoPoint, 
                    "CONAME", 
                    "NAICSCD", 
                    "NAICSDS", 
                    "LEMPSZCD", 
                    "LEMPSZDS", 
                    "ALEMPSZ", 
                    "PRMSICDS", 
                    "LSALVOLDS", 
                    "ALSLSVOL", 
                    "SQFOOTCD", 
                    "BE_Payroll_Expense_Code", 
                    "BE_Payroll_Expense_Range", 
                    "BE_Payroll_Expense_Description" 
                    FROM businesses_2014 as business, county  
                    `+where_clause+`
                    AND ST_Contains(county.geom, ST_Transform(business.geom, 4326)) 
                `;
        }

        */

        var with_clause = knex.with('county', knex.raw('SELECT ST_Transform(geom, 4326) AS geom FROM counties as county WHERE county.name LIKE \'%'+borough+'%\' LIMIT 1' ));
        var from_clause = {business: 'businesses_2014', county: 'county'};
        var where_county = 'ST_Contains(county.geom, ST_Transform(business.geom, 4326))';
        var where_industry = (industry != 'null') ? {NAICSDS: industry} : {};
        var where_salvol = (salvol != 'null') ? {LSALVOLDS: salvol} : {};
        var where_emplsize = (maxempl != 'null') ? '"ALEMPSZ" BETWEEN '+minempl+' AND '+maxempl+' ' : '';
        if (borough == 'null') {
            with_clause = knex;
            from_clause = {business: 'businesses_2014'};
            where_county = '';
        }
        var sql = with_clause.
                            column('id', 
                            knex.raw('ST_ASGeoJSON(ST_Transform(business.geom, 4326)) AS geoPoint'),
                            'CONAME',
                            'NAICSCD',
                            'NAICSDS',
                            'LEMPSZCD',
                            'LEMPSZDS',
                            'ALEMPSZ',
                            'PRMSICDS',
                            'LSALVOLDS',
                            'ALSLSVOL',
                            'SQFOOTCD',
                            'BE_Payroll_Expense_Code',
                            'BE_Payroll_Expense_Range',
                            'BE_Payroll_Expense_Description',
                            'BE_Payroll_Expense_Description').select().from(from_clause).
                            where(where_industry).
                            where(where_salvol).
                            whereRaw(where_emplsize).
                            whereRaw(where_county);
        
        sql = sql.toString();

        //console.log(sql);

        db_service.runQuery(sql, [], (err, data) => {
            if (err) return reject(err.stack);
            resolve(data.rows);
        });
    });
}

const advancedSearchRequest = function (request, response) {
    if (!request.query.industry) {
        return response.status(400)
            .json({
                status: 'Error',
                responseText: 'No industry specified'
            });
    }
    if (!request.query.minempl) {
        return response.status(400)
            .json({
                status: 'Error',
                responseText: 'No min employee specified'
            });
    }
    if (!request.query.maxempl) {
        return response.status(400)
            .json({
                status: 'Error',
                responseText: 'No max employee specified'
            });
    }
    if (!request.query.salvol) {
        return response.status(400)
            .json({
                status: 'Error',
                responseText: 'No sales volume specified'
            });
    }
    if (!request.query.borough) {
        return response.status(400)
            .json({
                status: 'Error',
                responseText: 'No borough specified'
            });
    }

    advancedSearch(request.query.industry, request.query.minempl, request.query.maxempl, request.query.salvol, request.query.borough)
        .then(data => {
            return response.status(200)
                .json({
                    data: data,
                });
        }, function (err) {
            console.error(err);
            return response.status(500)
                .json({
                    status: 'Error',
                    responseText: 'Error in query ' + err
                });
        });
}

module.exports = advancedSearchRequest;