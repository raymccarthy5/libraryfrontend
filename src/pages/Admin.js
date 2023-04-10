import { ListGroup } from 'react-bootstrap';

const links = [
    {id:1, url:"/", title:"Home"},
    {id:2, url:"admin-users", title:"Users"},
    {id:3, url:"admin-books", title:"Books"},
    {id:4, url:"admin-reservations", title:"Reservations"}
];

const Admin = () => {
    return (
        <>
        <div className="container-xxl">
        <section className="admin-page m-5">
        <ListGroup>
          {links.map(link => (
            <ListGroup.Item key={link.id} href={link.url} action>
              {link.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
        </section>
        </div>
        </>
      );
    };

export default Admin;