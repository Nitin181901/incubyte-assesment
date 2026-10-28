module Seeding
  module NamePools
    module_function

    WESTERN_FIRST = %w[
      James John Robert Michael David William Richard Joseph Thomas Charles
      Christopher Daniel Matthew Anthony Mark Donald Steven Paul Andrew Joshua
      Kevin Brian George Timothy Ronald Edward Jason Jeffrey Ryan Jacob
      Gary Nicholas Eric Jonathan Stephen Larry Justin Scott Brandon Benjamin
      Samuel Gregory Frank Raymond Jack Dennis Jerry Tyler Aaron Jose
      Nathan Henry Douglas Peter Adam Zachary Walter Kyle Harold Carl
      Jeremy Keith Roger Arthur Lawrence Terry Christian Sean Austin
      Mary Patricia Jennifer Linda Elizabeth Barbara Susan Jessica Sarah Karen
      Nancy Lisa Betty Margaret Sandra Ashley Dorothy Kimberly Emily Donna
      Michelle Carol Amanda Melissa Deborah Stephanie Rebecca Sharon Laura
      Cynthia Kathleen Amy Angela Shirley Anna Brenda Pamela Emma Nicole
      Helen Samantha Katherine Christine Debra Rachel Carolyn Janet Catherine
      Maria Heather Diane Julie Joyce Victoria Kelly Christina Joan Evelyn
      Lauren Judith Olivia Megan Andrea Cheryl Hannah Jacqueline Martha Gloria
    ].freeze

    WESTERN_LAST = %w[
      Smith Johnson Williams Brown Jones Garcia Miller Davis Rodriguez Martinez
      Hernandez Lopez Gonzalez Wilson Anderson Thomas Taylor Moore Jackson Martin
      Lee Perez Thompson White Harris Sanchez Clark Ramirez Lewis Robinson
      Walker Young Allen King Wright Scott Torri Torres Nguyen Hill Flores
      Green Adams Nelson Baker Hall Rivera Campbell Mitchell Carter Roberts
      Gomez Phillips Evans Turner Diaz Parker Cruz Edwards Collins Reyes
      Stewart Morris Morales Murphy Cook Rogers Gutierrez Ortiz Morgan Cooper
      Peterson Bailey Reed Kelly Howard Ramos Kim Cox Ward Richardson
      Watson Brooks Chavez Wood James Bennett Gray Mendoza Ruiz Hughes
      Price Alvarez Castillo Sanders Patel Myers Long Ross Foster Jimenez
    ].freeze

    INDIAN_FIRST = %w[
      Aarav Vivaan Aditya Vihaan Arjun Sai Reyansh Ayaan Krishna Ishaan
      Shaurya Atharv Advik Pranav Kabir Ansh Ryan Dhruv Aryan Rohan
      Kartik Yash Veer Aarush Laksh Ritvik Harsh Om Aaditya Darsh
      Krish Dev Shivansh Rudra Atharva Parth Kiaan Samar Rian Viraj
      Ananya Aadhya Aaradhya Anika Navya Diya Saanvi Myra Aanya Pari
      Angel Avni Anvi Kiara Prisha Riya Aria Shanaya Siya Myraa
      Ira Nora Kiaraa Aditi Ishita Khushi Tara Rashi Nisha Pooja
      Priya Neha Sneha Kavya Shruti Divya Meera Lakshmi Sita Radha
      Anita Sunita Deepa Geeta Rekha Seema Poonam Swati Ritu Nidhi
      Raj Amit Sanjay Vijay Suresh Ramesh Mahesh Ashok Vinod Manoj
      Rahul Nikhil Vivek Abhishek Gaurav Sachin Rohit Akash Manish Naveen
    ].freeze

    INDIAN_LAST = %w[
      Sharma Patel Verma Singh Kumar Gupta Reddy Mehta Joshi Chopra
      Kapoor Malhotra Agarwal Banerjee Chatterjee Mukherjee Das Bose Iyer Nair
      Menon Pillai Rao Krishnan Subramanian Srinivasan Raoo Naidu Prasad Desai
      Shah Jain Bansal Saxena Arora Khanna Bhat Bhatt Hegde Shetty
      Kulkarni Patil Jadhav More Shinde Pawar Gaikwad Chavan Kamble Joshiy
      Pandey Mishra Tiwari Dubey Yadav Chauhan Thakur Rathore Sisodia Solanki
      Gill Kaur Dhillon Sandhu Brar Sidhu Grewal Ahluwalia Anand Sethi
      Goel Bedi Talwar Suri Kohli Gambhir Raina Dravid Tendulkar Ganguly
      Khan Pathan Sheikh Ahmed Hussain Ansari Qureshi Siddiqui Mirza Beg
      Fernandes DSouza Rodrigues Pereira Costa Pinto Rocha Alves Lopes Dias
    ].freeze

    GERMAN_FIRST = %w[
      Hans Peter Klaus Jurgen Wolfgang Dieter Helmut Gunter Uwe Horst
      Werner Rolf Gerhard Karl Heinz Otto Fritz Franz Josef Andreas
      Thomas Michael Stefan Markus Christian Martin Oliver Tobias Matthias
      Sebastian Florian Philipp Lukas Jonas Leon Felix Max Paul Tim
      Anna Maria Ursula Monika Petra Sabine Claudia Susanne Birgit Karin
      Ingrid Helga Gisela Edith Elke Renate Christa Erika Brigitte Angelika
      Julia Sarah Laura Lisa Katharina Sophie Marie Lena Emma Hannah
      Mia Lea Lara Nina Jana Pia Nora Eva Ruth Helene
      Alexander Benjamin Daniel David Erik Fabian Gregor Henrik Ingo Jens
      Konrad Ludwig Niklas Oscar Patrick Quirin Rainer Sven Ulrich Viktor
    ].freeze

    GERMAN_LAST = %w[
      Mueller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann
      Schafer Koch Bauer Richter Klein Wolf Schroder Neumann Schwarz Zimmermann
      Braun Krueger Hofmann Hartmann Lange Schmitt Werner Schmitz Krause Meier
      Lehmann Schmid Schulze Maier Koehler Herrmann Koenig Walter Mayer Huber
      Kaiser Fuchs Peters Lang Scholz Moeller Weiss Jung Hahn Vogel
      Friedrich Keller Guenther Frank Berger Roth Beck Lorenz Baumann
      Franke Albrecht Ludwig Simon Vogt Schubert Sauer Haas Winkler Engels
      Brandt Winter Kraus Bohr Horn Dietrich Kellerer Seidel Grimm Brandtner
      Busch Engelsmann Kraft Pohl Ziegler Steiner Bergmann Kuhn Pfeiffer
      Langer Ahrens Bode Conrad Dietz Ernst Fuchsberger Graf Hein Junger
    ].freeze

    BRAZILIAN_FIRST = %w[
      Joao Pedro Lucas Mateus Gabriel Rafael Felipe Bruno Gustavo Thiago
      Leonardo Andre Rodrigo Marcelo Fernando Ricardo Eduardo Carlos Antonio Jose
      Paulo Marcos Diego Caio Renato Vinicius Murilo Otavio Enzo Arthur
      Maria Ana Julia Beatriz Larissa Camila Fernanda Patricia Juliana Amanda
      Gabriela Aline Vanessa Bruna Carolina Daniela Leticia Mariana Rafaela Sophia
      Isabella Helena Alice Laura Sophiaa Manuela Valentina Sophiae Heloisa Lorena
      Miguel Heitor Davi Bernardo Theo Samuel Lorenzo Benjamin Nicolas Pietro
      Yasmin Isis Agatha Liz Cecilia Olivia Ester Agathaa Maya Nina
      Roberto Sergio Luiz Fabio Alexandre Leandro Cristiano Wellington Adriano Igor
      Tatiane Priscila Simone Elaine Monica Cristina Adriana Luciana Simonee Eliane
    ].freeze

    BRAZILIAN_LAST = %w[
      Silva Santos Oliveira Souza Rodrigues Almeida Lima Ferreira Alves Pereira
      Gomes Costa Ribeiro Martins Carvalho Rocha Almeidaa Barbosa Ramos Araujo
      Castro Fernandes Pinto Mendes Cardoso Teixeira Correia Nunes Moreira Vieira
      Barbosaa Cunha Dias Freitas Soares Macedo Monteiro Campos Cardosoa Lopes
      Machado Reis Barros Duarte Fonseca Guimaraes Azevedo Moura Nogueira Pires
      Andrade Batista Borges Cavalcanti Coelho Esteves Farias Galvao Henriques Inacio
      Jesus Leal Magalhaes Neves Queiroz Rezende Sampaio Tavares Vargas Xavier
      Assis Brito Camargo Domingues Estevao Figueiredo Guedes Holanda Iglesias Junqueira
      Lacerda Medeiros Nobre Paiva Queiros Rangel Siqueira Toledo Uchoa Valente
      Amorim Bittencourt Coutinho Damasceno Estevesa Furtado Goulart Homem Isidoro Jardim
    ].freeze

    FLAVORS = {
      western: { first: WESTERN_FIRST, last: WESTERN_LAST },
      indian: { first: INDIAN_FIRST, last: INDIAN_LAST },
      german: { first: GERMAN_FIRST, last: GERMAN_LAST },
      brazilian: { first: BRAZILIAN_FIRST, last: BRAZILIAN_LAST }
    }.freeze

    COUNTRY_FLAVOR = {
      "US" => :western,
      "GB" => :western,
      "CA" => :western,
      "AU" => :western,
      "SG" => :western,
      "IN" => :indian,
      "DE" => :german,
      "BR" => :brazilian
    }.freeze

    def pick(country_code, random)
      flavor = FLAVORS.fetch(COUNTRY_FLAVOR.fetch(country_code))
      [
        flavor[:first][random.rand(flavor[:first].size)],
        flavor[:last][random.rand(flavor[:last].size)]
      ]
    end
  end
end
