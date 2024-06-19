package net.codejava.hibernate.HibernateJPABeginner;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

public class App 
{
	private void Inert(EntityManager entityManager)
	{
 		User newUser = new User();
		newUser.setEmail("billjoy@gmail.com");
		newUser.setFullname("bill Joy");
		newUser.setPassword("billi");

		entityManager.persist(newUser);
		entityManager.getTransaction().commit();

		System.out.println("INSERT ID: " + newUser.getId());
	}

	private void Upate(EntityManager entityManager)
	{
		User existingUser = new User();
		existingUser.setId(userID);
		existingUser.setEmail("bill.joy@gmail.com");
		existingUser.setFullname("Bill Joy");
		existingUser.setPassword("billionaire");

		entityManager.merge(existingUser);
		entityManager.getTransaction().commit();
	}

	private void Find(EntityManager entityManager)
	{
		Integer findPrimaryKey = userID;
		User findUser = entityManager.find(User.class, findPrimaryKey);
		
		entityManager.getTransaction().commit();

		System.out.println(findUser.getEmail());
		System.out.println(findUser.getFullname());
		System.out.println(findUser.getPassword());
	}

	private void Query(EntityManager entityManager)
	{
		String sql = "select u from User u where u.id = " + Integer.toString(userID);
		
		Query query = entityManager.createQuery(sql);
		User queryUser = (User) query.getSingleResult();
		
		entityManager.getTransaction().commit();
		
		System.out.println(queryUser.getEmail());
		System.out.println(queryUser.getFullname());
		System.out.println(queryUser.getPassword());
	}

	private void Remove(EntityManager entityManager)
	{
		Integer removePrimaryKey = userID;
		User reference = entityManager.getReference(User.class, removePrimaryKey);
		
		entityManager.remove(reference);
		entityManager.getTransaction().commit();
	}

	private enum JPA
	{
		INSERT,
		UPDATE,
		FIND,
		QUERY,
		REMOVE
	}

	JPA choose = JPA.INSERT;
	Integer userID = 1;

    public static void main(String[] args)
    {
		App app = new App();

    	EntityManagerFactory factory = Persistence.createEntityManagerFactory("UsersDB");
        EntityManager entityManager = factory.createEntityManager();

        entityManager.getTransaction().begin();

        switch (app.choose)
        {
			/*
			 * Insert an entity instance
			 */
    		case INSERT :
				app.Inert(entityManager);
		        break;

			/*
			 * Update an entity instance
			 */
	    	case UPDATE :
				app.Upate(entityManager);
				break;

			/*
			 * Find an entity instance
			 */
	    	case FIND :
			    app.Find(entityManager);
	    		break;
	    		
			/*
			 * Query an entity instance
			 */
	    	case QUERY :
			    app.Query(entityManager);
	    		break;
	    		
			/*
			 * Remove an entity instance
			 */
	    	case REMOVE :
			    app.Remove(entityManager);
	    		break;
		        
			default:
				break;
        }

        entityManager.close();
        factory.close();
    }
}
