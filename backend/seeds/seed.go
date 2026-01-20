package seeds

import (
	"ecommerce/internal/domain"
	"log"

	"gorm.io/gorm"
)

// Run seeds basic data
func Run(db *gorm.DB) {
	// Categories
	categories := []map[string]string{
		{"name": "Roupas Femininas", "slug": "roupas-femininas"},
		{"name": "Vestidos", "slug": "vestidos"},
		{"name": "Blusas", "slug": "blusas"},
		{"name": "Calças", "slug": "calcas"},
		{"name": "Saias", "slug": "saias"},
		{"name": "Roupas Masculinas", "slug": "roupas-masculinas"},
		{"name": "Acessórios", "slug": "acessorios"},
		{"name": "Bolsas", "slug": "bolsas"},
		{"name": "Joias", "slug": "joias"},
		{"name": "Relógios", "slug": "relogios"},
		{"name": "Calçados", "slug": "calcados"},
		{"name": "Sandálias", "slug": "sandalias"},
		{"name": "Tênis", "slug": "tenis"},
		{"name": "Sapatos", "sapatos"},
	}
	for _, c := range categories {
		if err := db.Exec("INSERT INTO categories (name, slug) VALUES (?, ?) ON CONFLICT (slug) DO NOTHING", c["name"], c["slug"]).Error; err != nil {
			log.Println("seed category error:", err)
		}
	}

	// Products
	products := []domain.Product{
		{
			Name:          "Vestido Midi Minimalista Preto",
			Slug:          "vestido-midi-minimalista-preto",
			Description:   "Vestido midi elegante em tecido premium com corte minimalista. Perfeito para ocasiões especiais e uso profissional. Detalhes em costura francesa e forro interno.",
			Price:         459.90,
			StockQuantity: 45,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Blazer Alfaiataria Oversized Caramelo",
			Slug:          "blazer-alfaiataria-oversized-caramelo",
			Description:   "Blazer oversized em alfaiataria italiana. Corte estruturado com ombros marcados e botões dourados. Forro em viscose premium.",
			Price:         689.90,
			StockQuantity: 30,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Calça Wide Leg Linho Off-White",
			Slug:          "calca-wide-leg-linho-off-white",
			Description:   "Calça pantalona em linho europeu com caimento wide leg. Cós alto, bolsos laterais e acabamento em pespontos contrastantes.",
			Price:         389.90,
			StockQuantity: 60,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Blusa Gola Alta Tricot Creme",
			Slug:          "blusa-gola-alta-tricot-creme",
			Description:   "Blusa em tricot premium com gola alta. Manga longa, textura canelada e caimento justo. Ideal para compor looks sofisticados.",
			Price:         259.90,
			StockQuantity: 80,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Saia Midi Plissada Navy",
			Slug:          "saia-midi-plissada-navy",
			Description:   "Saia midi plissada em crepe com movimento fluido. Cós embutido, zíper lateral invisível e forro em seda sintética.",
			Price:         349.90,
			StockQuantity: 50,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Vestido Longo Festa Veludo Verde Esmeralda",
			Slug:          "vestido-longo-festa-veludo-verde",
			Description:   "Vestido longo em veludo molhado com decote V profundo. Fenda lateral, alças ajustáveis e caimento sereia. Perfeito para eventos noturnos.",
			Price:         799.90,
			StockQuantity: 20,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Camisa Oversized Linho Branco",
			Slug:          "camisa-oversized-linho-branco",
			Description:   "Camisa oversized em linho puro com corte relaxado. Botões de madrepérola, mangas dobráveis e bolso no peito.",
			Price:         319.90,
			StockQuantity: 70,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Jeans Mom Fit Cintura Alta Azul Escuro",
			Slug:          "jeans-mom-fit-cintura-alta",
			Description:   "Jeans mom fit em denim premium com lavagem escura. Cintura alta, cinco bolsos e acabamento em barra dobrada.",
			Price:         279.90,
			StockQuantity: 90,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Conjunto Tricot Cropped + Saia Nude",
			Slug:          "conjunto-tricot-cropped-saia-nude",
			Description:   "Conjunto em tricot premium: top cropped manga curta + saia midi. Textura canelada e caimento estruturado.",
			Price:         489.90,
			StockQuantity: 40,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Vestido Tubinho Crepe Vinho",
			Slug:          "vestido-tubinho-crepe-vinho",
			Description:   "Vestido tubinho em crepe stretch com manga 3/4. Zíper lateral invisível, forro completo e comprimento midi.",
			Price:         399.90,
			StockQuantity: 55,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Blazer Cropped Tweed Rosa Claro",
			Slug:          "blazer-cropped-tweed-rosa",
			Description:   "Blazer cropped em tweed bouclê com detalhes em franjas. Botões revestidos em tecido e forro em cetim.",
			Price:         729.90,
			StockQuantity: 25,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Calça Reta Alfaiataria Preta",
			Slug:          "calca-reta-alfaiataria-preta",
			Description:   "Calça de alfaiataria com corte reto e vinco marcado. Cós médio, bolsos laterais e passantes para cinto.",
			Price:         339.90,
			StockQuantity: 65,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Body Gola Careca Manga Longa Preto",
			Slug:          "body-gola-careca-manga-longa-preto",
			Description:   "Body básico em malha suplex com alta elasticidade. Gola careca, manga longa e fechamento em colchetes.",
			Price:         149.90,
			StockQuantity: 100,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Saia Lápis Couro Ecológico Marrom",
			Slug:          "saia-lapis-couro-ecologico-marrom",
			Description:   "Saia lápis em couro ecológico de alta qualidade. Fenda traseira, zíper lateral e forro em malha.",
			Price:         289.90,
			StockQuantity: 45,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Vestido Chemise Linho Listrado",
			Slug:          "vestido-chemise-linho-listrado",
			Description:   "Vestido chemise em linho com listras verticais. Botões frontais, cinto amarração e bolsos laterais.",
			Price:         379.90,
			StockQuantity: 50,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Blusa Ombro a Ombro Renda Branca",
			Slug:          "blusa-ombro-ombro-renda-branca",
			Description:   "Blusa ciganinha em renda guipir com elástico nos ombros. Manga bufante e forro em malha delicada.",
			Price:         219.90,
			StockQuantity: 60,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Calça Jogger Crepe Bege",
			Slug:          "calca-jogger-crepe-bege",
			Description:   "Calça jogger em crepe premium com elástico na cintura e punhos. Bolsos laterais e cordão de ajuste.",
			Price:         299.90,
			StockQuantity: 70,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Macaquinho Linho Curto Terracota",
			Slug:          "macaquinho-linho-curto-terracota",
			Description:   "Macaquinho em linho puro com alças reguláveis. Decote quadrado, elástico na cintura e bolsos laterais.",
			Price:         329.90,
			StockQuantity: 40,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Vestido Longo Babados Floral",
			Slug:          "vestido-longo-babados-floral",
			Description:   "Vestido longo em viscose com estampa floral romântica. Babados em camadas, decote V e amarração nas costas.",
			Price:         449.90,
			StockQuantity: 35,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Colete Tricot Sem Manga Caramelo",
			Slug:          "colete-tricot-sem-manga-caramelo",
			Description:   "Colete em tricot premium sem mangas com decote V. Textura canelada e acabamento em barra reta.",
			Price:         189.90,
			StockQuantity: 75,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Saia Curta Jeans Destroyed",
			Slug:          "saia-curta-jeans-destroyed",
			Description:   "Saia jeans com efeito destroyed e barra desfiada. Botões frontais, bolsos funcionais e lavagem clara.",
			Price:         199.90,
			StockQuantity: 80,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Blazer Alongado Xadrez Cinza",
			Slug:          "blazer-alongado-xadrez-cinza",
			Description:   "Blazer alongado em tecido xadrez príncipe de gales. Corte estruturado, botões forrados e bolsos chapados.",
			Price:         659.90,
			StockQuantity: 30,
			IsActive:      true,
			IsFeatured:    true,
		},
		{
			Name:          "Calça Cargo Sarja Verde Militar",
			Slug:          "calca-cargo-sarja-verde-militar",
			Description:   "Calça cargo em sarja resistente com múltiplos bolsos utilitários. Cós com elástico e cordão de ajuste.",
			Price:         269.90,
			StockQuantity: 85,
			IsActive:      true,
			IsFeatured:    false,
		},
		{
			Name:          "Vestido Festa Paetês Dourado",
			Slug:          "vestido-festa-paetes-dourado",
			Description:   "Vestido curto todo bordado em paetês dourados. Alças finas, decote reto e forro em malha stretch.",
			Price:         889.90,
			StockQuantity: 15,
			IsActive:      true,
			IsFeatured:    true,
		},
	}

	for _, p := range products {
		if err := db.Create(&p).Error; err != nil {
			log.Printf("seed product error (%s): %v\n", p.Slug, err)
		} else {
			log.Printf("✓ Product created: %s\n", p.Name)
		}
	}

	log.Println("✅ Seed completed successfully!")
}
