import { useSearchParams, useParams } from 'react-router-dom';
import { Person } from '../types/Person';
import { getSearchWith } from '../utils/searchHelper';
import { PersonLink } from './PersonLink'; // Додаємо імпорт

type Props = {
  people: Person[];
};

export const PeopleTable: React.FC<Props> = ({ people }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams(); // Дістаємо поточну вибрану людину

  const currentSort = searchParams.get('sort');
  const currentOrder = searchParams.get('order');

  const handleSort = (field: keyof Person) => {
    // ... твоя логіка сортування залишається без змін ...
    let nextSort: string | null = field;
    let nextOrder: string | null = null;

    if (currentSort === field) {
      if (currentOrder !== 'desc') {
        nextOrder = 'desc';
      } else {
        nextSort = null;
        nextOrder = null;
      }
    }

    setSearchParams(
      getSearchWith(searchParams, {
        sort: nextSort,
        order: nextOrder,
      }),
    );
  };

  const getSortArrow = (field: string) => {
    // ... логіка стрілочок залишається ...
    if (currentSort !== field) {
      return '';
    }

    return currentOrder === 'desc' ? ' ▼' : ' ▲';
  };

  // Допоміжна функція для пошуку батьків
  const getPersonByName = (name: string) => people.find(p => p.name === name);

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        {/* ... твій thead з обробниками кліків залишається без змін ... */}
        <tr>
          <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
            Name{getSortArrow('name')}
          </th>
          <th onClick={() => handleSort('sex')} style={{ cursor: 'pointer' }}>
            Sex{getSortArrow('sex')}
          </th>
          <th onClick={() => handleSort('born')} style={{ cursor: 'pointer' }}>
            Born{getSortArrow('born')}
          </th>
          <th onClick={() => handleSort('died')} style={{ cursor: 'pointer' }}>
            Died{getSortArrow('died')}
          </th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>
      <tbody>
        {people.map(person => {
          const isSelected = person.slug === slug;
          const mother = person.motherName
            ? getPersonByName(person.motherName)
            : null;
          const father = person.fatherName
            ? getPersonByName(person.fatherName)
            : null;

          return (
            <tr
              key={person.slug}
              data-cy="person"
              className={isSelected ? 'has-background-warning' : ''}
            >
              <td>
                <PersonLink person={person} />
              </td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>
              <td>
                {!person.motherName ? (
                  '-'
                ) : mother ? (
                  <PersonLink person={mother} />
                ) : (
                  person.motherName
                )}
              </td>
              <td>
                {!person.fatherName ? (
                  '-'
                ) : father ? (
                  <PersonLink person={father} />
                ) : (
                  person.fatherName
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
