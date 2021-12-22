export default
{
  "and": [
    {
      "locked": {
        "=": [
          {
            "var": "name"
          },
          "Петр"
        ]
      }
    },
    {
      "locked": {
        "=": [
          {
            "var": "pet"
          },
          "Собака"
        ]
      }
    },
    {
      "or": [
        {
          "locked": {
            ">": [
              {
                "var": "balance"
              },
              1000
            ]
          }
        },
        {
          "and": [
            {
              "locked": {
                "=": [
                  {
                    "var": "city"
                  },
                  "Москва"
                ]
              }
            },
            {
              "locked": {
                ">": [
                  {
                    "var": "age"
                  },
                  18
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};
