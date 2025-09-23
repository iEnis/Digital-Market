# Digital Market

Sell your resources to recive Credits and buy stuff from a Digital Market

## For integration with this addon

Declare your stuff using tags inside your blocks and items

item names should be formatted in lowercase snakecase and will be converted to titlecase in runtime
"test_item" => "Test Item"

textures should use ":" instead of "/", also only panes will be displayed (2d, also for blocks)
(you can use "/" for only items if you wish but blocks only work with ":" )

like this

Items:
```jsonc
{
    "format_version": "1.21.101",
    "minecraft:item": {
        "description": {
            "identifier": "digitalmarket:shop",
            "menu_category": {
                "category": "equipment"
            }
        },
        "components": {
            "minecraft:max_stack_size": 1,
            "digitalmarket:shop": {},
            "minecraft:icon": "book_written",
            "minecraft:tags": {
                "tags": [
                    "digitalmarket:name:shop",
                    "digitalmarket:price:10",
                    "digitalmarket:texture:textures:items:book_written"
                ]
            }
        }
    }
}
```

Blocks:
```jsonc
{
    "format_version": "1.21.101",
    "minecraft:block": {
        "description": {
            "identifier": "digitalmarket:block"
        },
        "components": {
            "minecraft:geometry": "minecraft:geometry.full_block",
            "minecraft:material_instances": {
                "*": {
                    "texture": "cherry_log_top",
                    "render_method": "alpha_test"
                }
            },
            "tag:digitalmarket:name:cherry_log": {},
            "tag:digitalmarket:texture:textures:blocks:cherry_log_top": {},
            "tag:digitalmarket:price:100": {}
        }
    }
}
```

Here's the Typedoc if you need it

```ts
/**
 * You don't need to use bigint types because
 * they'll be converted to bigint anyways
 */

type DigitalMarket = {
    typeId: string;
    texture: string;
    // This will be used in the Search when you buy an item or when you sell an item
    name: string;
} & (onlyBuy | onlySell | normal);

type onlySell = {
    buyable: false;
    sell: number | bigint;
    sellable?: true;
};

type onlyBuy = {
    sellable: false;
    buyable?: true;
    price: number | bigint;
};

type normal = {
    price: number | bigint;
    sell?: number | bigint;
    sellable?: true;
    buyable?: true;
};
```