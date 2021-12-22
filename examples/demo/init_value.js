export default
{
  "id": "98ba9b9a-cdef-4012-b456-717dc4fdf833",
  "rules": [
    {
      "id": "9ba9b999-89ab-4cde-b012-317dc4fdf833",
      "fieldName": "name",
      "type": "text",
      "input": "text",
      "operator": "equal",
      "values": [
        {
          "type": "text",
          "value": "Петр"
        }
      ]
    },
    {
      "id": "a8bba8a8-4567-489a-bcde-f17dc4fe0087",
      "fieldName": "pet",
      "type": "text",
      "input": "text",
      "operator": "equal",
      "values": [
        {
          "type": "text",
          "value": "Собака"
        }
      ]
    },
    {
      "id": "99ba8898-0123-4456-b89a-b17dc4fe15e1",
      "rules": [
        {
          "id": "a99ba889-cdef-4012-b456-717dc4fe15e2",
          "fieldName": "balance",
          "type": "number",
          "input": "number",
          "operator": "greater",
          "values": [
            {
              "type": "number",
              "value": 1000
            }
          ]
        },
        {
          "id": "8b8ab8ab-89ab-4cde-b012-317dc4fe2635",
          "rules": [
            {
              "id": "ba88989b-4567-489a-bcde-f17dc4fe2636",
              "fieldName": "city",
              "type": "text",
              "input": "text",
              "operator": "equal",
              "values": [
                {
                  "type": "text",
                  "value": "Москва"
                }
              ]
            },
            {
              "id": "99aa8898-0123-4456-b89a-b17dc4fe2b34",
              "fieldName": "age",
              "type": "number",
              "input": "number",
              "operator": "greater",
              "values": [
                {
                  "type": "number",
                  "value": 18
                }
              ]
            }
          ],
          "condition": "AND",
          "not": false
        }
      ],
      "condition": "OR",
      "not": false
    }
  ],
  "condition": "AND",
  "not": false,
  "usedFields": [
    "name",
    "pet",
    "balance",
    "city",
    "age"
  ]
};
